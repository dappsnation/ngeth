import { Inject, Injectable, InjectionToken, Optional } from "@angular/core";
import { Router } from "@angular/router";
import { HasWalletGuard } from "@ngeth/ethers";

const downloadUrls = {
  chrome: 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
  firefox: 'https://addons.mozilla.org/firefox/addon/ether-metamask/',
  default: 'https://metamask.io',
};
const forwarderOrigin = 'https://fwd.metamask.io';
const forwarderId = 'metamask:forwarder';
function getDownloadUrl() { 
  const agent = window.navigator.userAgent.toLowerCase()
  switch (true) {
    case agent.indexOf('edge') > -1:
      return downloadUrls.chrome;
    case agent.indexOf('chrome') > -1 && !!(<any>window).chrome:
      return downloadUrls.chrome;
    case agent.indexOf('firefox') > -1:
      return downloadUrls.firefox;
    default:
      return downloadUrls.default;
  }
}

/**
 * Page to redirect to once Metamask is installed through onboarding process
 * Use [MetaMaskOnboarding].redirect & [MetaMaskOnboarding].state to display option on the page
 */
const METAMASK_REGISTER_PAGE = new InjectionToken<string>('Page to redirect to once Metamask has finish onboarding');

type OnboardingState = 'installed' | 'notInstalled' | 'registered' | 'registering' | 'reloading';

@Injectable({ providedIn: 'root' })
export class MetaMaskOnboarding {

  constructor(
    private router: Router,
    @Optional() private guard?: HasWalletGuard,
    @Optional() @Inject(METAMASK_REGISTER_PAGE) private registerPage?: string
  ) {
    if (this.state === 'reloading') this.onboard();
    this.state = this.hasMetamask() ? 'installed' : 'notInstalled';
  }

  get redirect(): string | null {
    return sessionStorage.getItem('metamask:onboarding:redirect');
  }

  set redirect(path: string | null) {
    if (!path) {
      sessionStorage.removeItem('metamask:onboarding:redirect');
    } else {
      sessionStorage.setItem('metamask:onboarding:redirect', path);
    }
  }

  get state(): OnboardingState | null {
    return sessionStorage.getItem('metamask:onboarding:state') as OnboardingState | null;
  }

  set state(state: OnboardingState | null) {
    if (!state) {
      sessionStorage.removeItem('metamask:onboarding:state');
    } else {
      sessionStorage.setItem('metamask:onboarding:state', state);
    }
  }

  hasMetamask() {
    return (window as any).ethereum?.isMetaMask;
  }

  /**
   * Starts onboarding by opening the MetaMask download page and the Onboarding forwarder
   * @note ⚠️ it will reload the page once metamask is installed. Save current in sessionStorage 
   */
  install() {
    this.injectForwarder();
    const url = getDownloadUrl();
    window.open(url, '_blank');
    const listener = async (event: MessageEvent) => {
      if (event.origin !== forwarderOrigin) return;
      if (event.data.type !== 'metamask:reload') return;
      this.state = 'reloading';
      this.redirect = this.guard?.previous ?? null;
      this.cleanup(listener);
      location.reload();
    }
    window.addEventListener('message', listener);
  }

  async onboard() {
    if (this.registerPage) {
      await this.router.navigateByUrl(this.registerPage);
    }
    return new Promise<void>((res, rej) => {
      this.injectForwarder();
      const listener = async (event: MessageEvent) => {
        if (event.origin !== forwarderOrigin) return;
        if (event.data.type !== 'metamask:reload') return;
        if (this.state !== 'installed') return;
        // Register app after 100ms to make sure metask onboarding is open
        setTimeout(async () => {
          this.state = 'registering';
          await (window as any).ethereum.request({
            method: 'wallet_registerOnboarding',
          });
          (event.source as Window).postMessage(
            { type: 'metamask:registrationCompleted' },
            event.origin,
          );
          this.state = 'registered';
          this.cleanup(listener);
          res();
        }, 100)
      }
      window.addEventListener('message', listener);
    })
  }

  private cleanup(listener: (event: MessageEvent) => Promise<void>) {
    window.removeEventListener('message', listener);
    document.getElementById(forwarderId)?.remove();
  }

  private injectForwarder() {
    if (document.getElementById(forwarderId)) return;
    const iframe = document.createElement('iframe');
    iframe.setAttribute('height', '0');
    iframe.setAttribute('width', '0');
    iframe.setAttribute('style', 'display: none;');
    iframe.setAttribute('src', forwarderOrigin);
    iframe.setAttribute('id', forwarderId);
    document.body.insertBefore(iframe, document.body.children[0]);
  }

}
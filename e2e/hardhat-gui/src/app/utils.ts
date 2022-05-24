import { inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { filter, map } from "rxjs/operators";

export function exist<T>(v?: T | null): v is T {
  return v !== undefined && v !== null;
}

export function routeParam(params: string) {
  return inject(ActivatedRoute).paramMap.pipe(
    map(paramMap => paramMap.get(params)),
    filter(exist)
  );
}
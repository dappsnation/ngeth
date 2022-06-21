import { FormControl, FormGroup, Validators } from "@angular/forms";
import { EthValidators } from "../../form";
export class ERC721FormTransfer extends FormGroup {
    constructor(value = {}) {
        super({
            from: new FormControl(value.from, [EthValidators.address]),
            to: new FormControl(value.to, [Validators.required, EthValidators.address]),
            tokenId: new FormControl(value.tokenId, [Validators.required]),
        });
    }
    setTokens(tokenIds) {
        this.get('tokenId')?.addValidators(EthValidators.ownToken(tokenIds));
    }
}
export class ERC721FormMint extends FormGroup {
    constructor(value = {}) {
        super({
            to: new FormControl(value.to, [Validators.required, EthValidators.address]),
            tokenId: new FormControl(value.tokenId, [Validators.required]),
            uri: new FormControl(value.uri, [Validators.required]),
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL2V0aGVycy9hbmd1bGFyL3NyYy9saWIvdG9rZW5zL2VyYzcyMS9mb3JtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3BFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFpQjNDLE1BQU0sT0FBTyxrQkFBbUIsU0FBUSxTQUF5QztJQUMvRSxZQUFZLFFBQWlDLEVBQUU7UUFDN0MsS0FBSyxDQUFDO1lBQ0osSUFBSSxFQUFFLElBQUksV0FBVyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDMUQsRUFBRSxFQUFFLElBQUksV0FBVyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUMzRSxPQUFPLEVBQUUsSUFBSSxXQUFXLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUMvRCxDQUFDLENBQUE7SUFDSixDQUFDO0lBRUQsU0FBUyxDQUFDLFFBQWtCO1FBQzFCLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEVBQUUsYUFBYSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUN2RSxDQUFDO0NBQ0Y7QUFHRCxNQUFNLE9BQU8sY0FBZSxTQUFRLFNBQXFDO0lBQ3ZFLFlBQVksUUFBNkIsRUFBRTtRQUN6QyxLQUFLLENBQUM7WUFDSixFQUFFLEVBQUUsSUFBSSxXQUFXLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzNFLE9BQU8sRUFBRSxJQUFJLFdBQVcsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzlELEdBQUcsRUFBRSxJQUFJLFdBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ3ZELENBQUMsQ0FBQTtJQUNKLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEZvcm1Db250cm9sLCBGb3JtR3JvdXAsIFZhbGlkYXRvcnMgfSBmcm9tIFwiQGFuZ3VsYXIvZm9ybXNcIjtcbmltcG9ydCB7IEV0aFZhbGlkYXRvcnMgfSBmcm9tIFwiLi4vLi4vZm9ybVwiO1xuaW1wb3J0IHsgVG9Gb3JtQ29udHJvbHMgfSBmcm9tIFwiLi4vdXRpbHNcIjtcblxuaW50ZXJmYWNlIEVSQzcyMVRyYW5zZmVyIHtcbiAgZnJvbT86IHN0cmluZztcbiAgdG86IHN0cmluZztcbiAgdG9rZW5JZDogbnVtYmVyO1xufVxuXG5pbnRlcmZhY2UgRVJDNzIxTWludCB7XG4gIHRvOiBzdHJpbmc7XG4gIHRva2VuSWQ6IG51bWJlcjtcbiAgdXJpOiBzdHJpbmc7XG59XG5cblxuXG5leHBvcnQgY2xhc3MgRVJDNzIxRm9ybVRyYW5zZmVyIGV4dGVuZHMgRm9ybUdyb3VwPFRvRm9ybUNvbnRyb2xzPEVSQzcyMVRyYW5zZmVyPj4ge1xuICBjb25zdHJ1Y3Rvcih2YWx1ZTogUGFydGlhbDxFUkM3MjFUcmFuc2Zlcj4gPSB7fSkge1xuICAgIHN1cGVyKHtcbiAgICAgIGZyb206IG5ldyBGb3JtQ29udHJvbCh2YWx1ZS5mcm9tLCBbRXRoVmFsaWRhdG9ycy5hZGRyZXNzXSksXG4gICAgICB0bzogbmV3IEZvcm1Db250cm9sKHZhbHVlLnRvLCBbVmFsaWRhdG9ycy5yZXF1aXJlZCwgRXRoVmFsaWRhdG9ycy5hZGRyZXNzXSksXG4gICAgICB0b2tlbklkOiBuZXcgRm9ybUNvbnRyb2wodmFsdWUudG9rZW5JZCwgW1ZhbGlkYXRvcnMucmVxdWlyZWRdKSxcbiAgICB9KVxuICB9XG5cbiAgc2V0VG9rZW5zKHRva2VuSWRzOiBzdHJpbmdbXSkge1xuICAgIHRoaXMuZ2V0KCd0b2tlbklkJyk/LmFkZFZhbGlkYXRvcnMoRXRoVmFsaWRhdG9ycy5vd25Ub2tlbih0b2tlbklkcykpO1xuICB9XG59XG5cblxuZXhwb3J0IGNsYXNzIEVSQzcyMUZvcm1NaW50IGV4dGVuZHMgRm9ybUdyb3VwPFRvRm9ybUNvbnRyb2xzPEVSQzcyMU1pbnQ+PiB7XG4gIGNvbnN0cnVjdG9yKHZhbHVlOiBQYXJ0aWFsPEVSQzcyMU1pbnQ+ID0ge30pIHtcbiAgICBzdXBlcih7XG4gICAgICB0bzogbmV3IEZvcm1Db250cm9sKHZhbHVlLnRvLCBbVmFsaWRhdG9ycy5yZXF1aXJlZCwgRXRoVmFsaWRhdG9ycy5hZGRyZXNzXSksXG4gICAgICB0b2tlbklkOiBuZXcgRm9ybUNvbnRyb2wodmFsdWUudG9rZW5JZCwgW1ZhbGlkYXRvcnMucmVxdWlyZWRdKSxcbiAgICAgIHVyaTogbmV3IEZvcm1Db250cm9sKHZhbHVlLnVyaSwgW1ZhbGlkYXRvcnMucmVxdWlyZWRdKSxcbiAgICB9KVxuICB9XG59Il19
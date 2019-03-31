import { CallTarget } from '../constants/callTarget';

export class Target {
  private name: CallTarget;
  private urn: string = '';
  private publicIdentity: string = '';
  private phone: number;

  constructor(name: CallTarget, urn: string, publicIdentity: string, phone: number) {
    this.name = name;
    this.urn = urn;
    this.publicIdentity = publicIdentity;
    this.phone = phone;
  }

  public setName(name: CallTarget) {
    this.name = name;
  }

  public getName(): CallTarget {
    return this.name;
  }

  public setUrn(urn: string) {
    this.urn = urn;
  }

  public getUrn(): string {
    return this.urn;
  }

  public setPublicIdentity(publicIdentity: string) {
    this.publicIdentity = publicIdentity;
  }

  public getPublicIdentity(): string {
    return this.publicIdentity;
  }

  public setPhone(phone: number) {
    this.phone = phone;
  }

  public getPhone(): number {
    return this.phone;
  }
}

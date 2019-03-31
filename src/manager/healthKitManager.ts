import { Injectable } from '@angular/core';
import { HealthKit } from '@ionic-native/health-kit';

@Injectable()
export class HealthKitManager {
  private isAvailable: boolean = false;
  private hasPermissions: boolean = false;
  private bloodType: any = null;
  private height: any = null;
  private gender: any = null;
  private dateOfBirth: any = null;
  private weight: any = null;

  constructor(protected healthKit: HealthKit) {
    //this.initHealhKit();
  }

  public getIsAvailable(): boolean {
    return this.isAvailable;
  }

  public getBloodType() {
    return this.bloodType;
  }

  public getGender() {
    return this.gender;
  }

  public getHeight() {
    if (this.height) {
      return `${Math.trunc(this.height.value)} ${this.height.unit}`;
    } else {
      return 'unknown';
    }
  }

  public getWeight() {
    if (this.weight) {
      return `${Math.trunc(this.weight.value)} ${this.weight.unit}`;
    } else {
      return 'unknown';
    }
  }

  public getDateOfBirth() {
    return this.dateOfBirth;
  }

  private initHealhKit() {
    this.healthKit.available().then(
      () => {
        this.isAvailable = true;
        this.healthKit.requestAuthorization({ readTypes: ['HKQuantityTypeIdentifierHeight'], requestReadPermission: true }).then(
          success => {
            this.hasPermissions = true;
            this.healthKit.readBloodType().then(bloodType => {
              this.bloodType = bloodType;
            });
            this.healthKit.readHeight({ unit: 'cm' }).then(
              height => {
                this.height = height;
              },
              err => {
                console.log(err);
              }
            );
            this.healthKit.readGender().then(gender => {
              this.gender = gender;
            });
            this.healthKit.readDateOfBirth().then(dateOfBirth => {
              this.dateOfBirth = dateOfBirth;
            });
            this.healthKit.readWeight({ unit: 'kg' }).then(weight => {
              this.weight = weight;
            });
          },
          err => {
            this.hasPermissions = false;
          }
        );
      },
      err => {
        this.isAvailable = false;
      }
    );
  }
}

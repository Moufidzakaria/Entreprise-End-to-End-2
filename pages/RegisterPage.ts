import { Page, Locator } from '@playwright/test';

export class RegisterPage {
  private page: Page;
  private genderMrRadio: Locator;
  private passwordInput: Locator;
  private daysSelect: Locator;
  private monthsSelect: Locator;
  private yearsSelect: Locator;
  private newsletterCheckbox: Locator;
  private optinCheckbox: Locator;
  private firstNameInput: Locator;
  private lastNameInput: Locator;
  private companyInput: Locator;
  private address1Input: Locator;
  private address2Input: Locator;
  private countrySelect: Locator;
  private stateInput: Locator;
  private cityInput: Locator;
  private zipcodeInput: Locator;
  private mobileInput: Locator;
  private createAccountButton: Locator;
  private continueButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.genderMrRadio = page.getByRole('radio', { name: 'Mr.' });
    this.passwordInput = page.locator('#password');
    this.daysSelect = page.locator('#days');
    this.monthsSelect = page.locator('#months');
    this.yearsSelect = page.locator('#years');
    this.newsletterCheckbox = page.locator('#newsletter');
    this.optinCheckbox = page.locator('#optin');
    this.firstNameInput = page.locator('#first_name');
    this.lastNameInput = page.locator('#last_name');
    this.companyInput = page.locator('#company');
    this.address1Input = page.locator('#address1');
    this.address2Input = page.locator('#address2');
    this.countrySelect = page.locator('#country');
    this.stateInput = page.locator('#state');
    this.cityInput = page.locator('#city');
    this.zipcodeInput = page.locator('#zipcode');
    this.mobileInput = page.locator('#mobile_number');
    this.createAccountButton = page.getByRole('button', { name: 'Create Account' });
    this.continueButton = page.getByRole('link', { name: 'Continue' });
  }

  async fillAccountInformation(password: string, day: string, month: string, year: string) {
    await this.genderMrRadio.check();
    await this.passwordInput.fill(password);
    await this.daysSelect.selectOption(day);
    await this.monthsSelect.selectOption(month);
    await this.yearsSelect.selectOption(year);
    await this.newsletterCheckbox.check();
    await this.optinCheckbox.check();
  }

  async fillAddressInformation(details: any) {
    await this.firstNameInput.fill(details.firstName);
    await this.lastNameInput.fill(details.lastName);
    await this.companyInput.fill(details.company);
    await this.address1Input.fill(details.address1);
    await this.address2Input.fill(details.address2);
    await this.countrySelect.selectOption(details.country);
    await this.stateInput.fill(details.state);
    await this.cityInput.fill(details.city);
    await this.zipcodeInput.fill(details.zipcode);
    await this.mobileInput.fill(details.mobile);
  }

  async submitRegistration() {
    await this.createAccountButton.click();
  }

  async clickContinue() {
    await this.continueButton.click();
  }
}
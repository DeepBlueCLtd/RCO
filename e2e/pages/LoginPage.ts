import { type Locator, type Page } from '@playwright/test'
import BasePage from './BasePage'

export default class LoginPage extends BasePage {
  readonly usernameInputField: Locator
  readonly passwordInputField: Locator
  readonly loginButton: Locator
  readonly invalidUserOrPasswordMessage: Locator

  constructor(page: Page) {
    super(page)
    this.usernameInputField = page.locator('#username')
    this.passwordInputField = page.locator('#password')
    this.loginButton = page.locator('button[type="submit"]')
    this.invalidUserOrPasswordMessage = page.locator(
      '//div[contains(@class, "MuiSnackbarContent-message")]'
    )
  }

  /**
   * Perform user login
   */
  public async login(username: string, password: string) {
    await this.usernameInputField.type(username)
    await this.passwordInputField.type(password)
    await this.loginButton.click()
    await this.page.waitForLoadState()
  }
}

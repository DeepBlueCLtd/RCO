import { type Page } from '@playwright/test'

export default class BasePage {
  readonly page: Page
  constructor(page: Page) {
    this.page = page
  }

  async goto(url: string) {
    await this.page.goto(url)
  }
}

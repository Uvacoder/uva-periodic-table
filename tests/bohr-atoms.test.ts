import { expect, test } from '@playwright/test'
import { element_data } from './index.ts'

test.describe(`Bohr Atoms page`, () => {
  test(`lists all elements`, async ({ page }) => {
    await page.goto(`/bohr-atoms`, { waitUntil: `networkidle` })

    const element_tiles = await page.$$(`ol > li > svg > circle + text`)
    expect(element_tiles).toHaveLength(element_data.length)
  })

  test(`SVG elements have expected height`, async ({ page }) => {
    await page.goto(`/bohr-atoms`, { waitUntil: `networkidle` })

    const first_svg = await page.$(`ol > li > svg`)
    const { height } = (await first_svg?.boundingBox()) ?? {}

    expect(height).toBe(300)
  })

  test(`can toggle orbiting electron animation`, async ({ page }) => {
    await page.goto(`/bohr-atoms`, { waitUntil: `networkidle` })

    const shell_svg_group = await page.locator(`svg > g.shell >> nth=1`)

    const initial_animation_duration = await shell_svg_group.evaluate(
      (el) => getComputedStyle(el).animationDuration
    )
    expect(parseInt(initial_animation_duration)).toBeGreaterThan(0)

    await page.fill(`input[type="number"]`, `0`)
    const toggled_animation_duration = await shell_svg_group.evaluate(
      (el) => getComputedStyle(el).animationDuration
    )
    expect(toggled_animation_duration).toBe(`0s`)
  })
})

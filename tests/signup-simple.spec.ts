import { test, expect } from '@playwright/test'

test('Complete signup form submission', async ({ page }) => {
  console.log('🚀 Starting signup test...')
  
  // Navigate to signup page
  await page.goto('http://localhost:3000/signup')
  await expect(page.locator('h1:has-text("Formulir Pendaftaran")')).toBeVisible()
  console.log('✅ Page loaded')

  // STEP 1: Data Siswa
  console.log('📝 Step 1: Data Siswa')
  await page.fill('input#namaLengkap', 'Ahmad Fauzi Ramadhan')
  await page.fill('input#tempatLahir', 'Jakarta')
  await page.fill('input#tanggalLahir', '2010-05-15')
  await page.click('label:has-text("Laki-laki")')
  await page.fill('textarea#alamatLengkap', 'Jl. Merdeka No. 123, Jakarta Selatan')
  await page.fill('input#noHP', '081234567890')
  await page.fill('input#email', 'ahmad.fauzi@example.com')
  await page.click('button:has-text("Selanjutnya")')
  await page.waitForTimeout(1000)
  console.log('✅ Step 1 complete')

  // STEP 2: Data Orangtua
  console.log('📝 Step 2: Data Orangtua')
  await page.fill('input#namaAyah', 'Budi Ramadhan')
  await page.fill('input#pekerjaanAyah', 'Wiraswasta')
  await page.fill('input#namaIbu', 'Siti Aminah')
  await page.fill('input#pekerjaanIbu', 'Guru')
  await page.fill('input#noHPOrangtua', '082345678901')
  await page.click('button:has-text("Selanjutnya")')
  await page.waitForTimeout(1000)
  console.log('✅ Step 2 complete')

  // STEP 3: Data Sekolah
  console.log('📝 Step 3: Data Sekolah')
  await page.fill('input#asalSekolah', 'SD Negeri 1 Jakarta')
  await page.fill('input#alamatSekolah', 'Jl. Pendidikan No. 45, Jakarta Selatan')
  await page.click('button:has-text("Selanjutnya")')
  await page.waitForTimeout(1000)
  console.log('✅ Step 3 complete')

  // STEP 4: Data Tambahan - SKIP dropdown for now
  console.log('📝 Step 4: Data Tambahan (skipping optional fields)')
  // Just go to next step without filling optional fields
  await page.click('button:has-text("Selanjutnya")')
  await page.waitForTimeout(1000)
  console.log('✅ Step 4 complete')

  // STEP 5: Konfirmasi
  console.log('📝 Step 5: Konfirmasi')
  
  // Wait for summary to be visible
  await expect(page.locator('text=Ringkasan Data')).toBeVisible()
  
  // Check checkbox
  const checkbox = page.locator('input[type="checkbox"]#persetujuan')
  await expect(checkbox).toBeVisible()
  
  console.log('🔲 Clicking checkbox...')
  await checkbox.click()
  await page.waitForTimeout(500)
  
  // Verify button is enabled
  const submitButton = page.locator('button:has-text("Kirim Pendaftaran")')
  await expect(submitButton).toBeEnabled()
  console.log('✅ Submit button is enabled!')
  
  // Take screenshot
  await page.screenshot({ path: 'tests/screenshots/before-submit.png', fullPage: true })
  console.log('📸 Screenshot: before-submit.png')

  // Submit form
  console.log('🚀 Submitting form...')
  await submitButton.click()
  
  // Wait for success page (increase timeout to 15 seconds)
  console.log('⏳ Waiting for success message...')
  await expect(page.locator('text=Pendaftaran Berhasil')).toBeVisible({ timeout: 15000 })
  
  // Get registration number
  const regNumber = await page.locator('.text-emerald-600').first().textContent()
  console.log(`🎉 SUCCESS! Registration Number: ${regNumber}`)
  
  // Take screenshot
  await page.screenshot({ path: 'tests/screenshots/success.png', fullPage: true })
  console.log('📸 Screenshot: success.png')
  
  // Verify format
  expect(regNumber).toMatch(/SPMB-\d{4}-\d{4}/)
  
  console.log('✅ ✅ ✅ TEST PASSED! ✅ ✅ ✅')
})


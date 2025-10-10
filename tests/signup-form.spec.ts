import { test, expect } from '@playwright/test'

test.describe('Signup Form - Complete Flow', () => {
  test('should complete full registration process', async ({ page }) => {
    // Navigate to signup page
    await page.goto('http://localhost:3000/signup')
    
    // Wait for page to load
    await expect(page.locator('h1:has-text("Formulir Pendaftaran")')).toBeVisible()
    
    console.log('✅ Step 0: Page loaded successfully')

    // ===== STEP 1: Data Siswa =====
    console.log('📝 Step 1: Filling Data Siswa...')
    
    await page.fill('input#namaLengkap', 'Ahmad Fauzi Ramadhan')
    await page.fill('input#tempatLahir', 'Jakarta')
    await page.fill('input#tanggalLahir', '2010-05-15')
    
    // Click radio button for Laki-laki
    await page.click('label:has-text("Laki-laki")')
    
    await page.fill('textarea#alamatLengkap', 'Jl. Merdeka No. 123, Jakarta Selatan')
    await page.fill('input#noHP', '081234567890')
    await page.fill('input#email', 'ahmad.fauzi@example.com')
    
    console.log('✅ Step 1: Data Siswa filled')
    
    // Click Next
    await page.click('button:has-text("Selanjutnya")')
    await page.waitForTimeout(500)

    // ===== STEP 2: Data Orangtua =====
    console.log('📝 Step 2: Filling Data Orangtua...')
    
    await page.fill('input#namaAyah', 'Budi Ramadhan')
    await page.fill('input#pekerjaanAyah', 'Wiraswasta')
    await page.fill('input#namaIbu', 'Siti Aminah')
    await page.fill('input#pekerjaanIbu', 'Guru')
    await page.fill('input#noHPOrangtua', '082345678901')
    
    console.log('✅ Step 2: Data Orangtua filled')
    
    // Click Next
    await page.click('button:has-text("Selanjutnya")')
    await page.waitForTimeout(500)

    // ===== STEP 3: Data Sekolah =====
    console.log('📝 Step 3: Filling Data Sekolah...')
    
    await page.fill('input#asalSekolah', 'SD Negeri 1 Jakarta')
    await page.fill('input#alamatSekolah', 'Jl. Pendidikan No. 45, Jakarta Selatan')
    
    console.log('✅ Step 3: Data Sekolah filled')
    
    // Click Next
    await page.click('button:has-text("Selanjutnya")')
    await page.waitForTimeout(500)

    // ===== STEP 4: Data Tambahan =====
    console.log('📝 Step 4: Filling Data Tambahan...')
    
    // Select jalur pendaftaran
    await page.click('[role="combobox"]:near(:text("Jalur Pendaftaran"))')
    await page.waitForTimeout(300)
    await page.click('text=Jalur Reguler')
    await page.waitForTimeout(300)
    
    // Select gelombang
    await page.click('[role="combobox"]:near(:text("Gelombang Pendaftaran"))')
    await page.waitForTimeout(300)
    await page.click('text=Gelombang 1')
    await page.waitForTimeout(300)
    
    // Fill prestasi (optional)
    await page.fill('textarea#prestasi', 'Juara 1 Olimpiade Matematika Tingkat Kecamatan 2023')
    
    console.log('✅ Step 4: Data Tambahan filled')
    
    // Click Next to confirmation
    await page.click('button:has-text("Selanjutnya")')
    await page.waitForTimeout(500)

    // ===== STEP 5: Konfirmasi =====
    console.log('📝 Step 5: Confirmation page...')
    
    // Check if summary is visible
    await expect(page.locator('text=Ringkasan Data')).toBeVisible()
    
    // Check if checkbox is present
    const checkbox = page.locator('input[type="checkbox"]#persetujuan')
    await expect(checkbox).toBeVisible()
    
    console.log('⚠️  Checking checkbox state...')
    const isChecked = await checkbox.isChecked()
    console.log(`   Checkbox checked: ${isChecked}`)
    
    // Check button state before clicking checkbox
    const submitButton = page.locator('button:has-text("Kirim Pendaftaran")')
    const isDisabledBefore = await submitButton.isDisabled()
    console.log(`   Submit button disabled before: ${isDisabledBefore}`)
    
    // Click checkbox if not checked
    if (!isChecked) {
      console.log('📋 Clicking checkbox...')
      await checkbox.click()
      await page.waitForTimeout(300)
    }
    
    // Check button state after clicking checkbox
    const isDisabledAfter = await submitButton.isDisabled()
    console.log(`   Submit button disabled after: ${isDisabledAfter}`)
    
    // Verify button is now enabled
    await expect(submitButton).toBeEnabled()
    
    console.log('✅ Step 5: Checkbox clicked, button enabled')
    
    // Take screenshot before submit
    await page.screenshot({ path: 'tests/screenshots/before-submit.png', fullPage: true })
    console.log('📸 Screenshot saved: before-submit.png')

    // ===== SUBMIT =====
    console.log('🚀 Submitting form...')
    
    // Click submit button
    await submitButton.click()
    
    // Wait for response (max 10 seconds)
    await page.waitForTimeout(3000)
    
    // ===== VERIFY SUCCESS =====
    console.log('✅ Verifying success page...')
    
    // Check for success message
    await expect(page.locator('text=Pendaftaran Berhasil')).toBeVisible({ timeout: 10000 })
    
    // Check for registration number
    await expect(page.locator('text=Nomor Pendaftaran')).toBeVisible()
    
    // Get registration number
    const regNumber = await page.locator('.text-emerald-600').textContent()
    console.log(`🎉 Registration Number: ${regNumber}`)
    
    // Take screenshot of success page
    await page.screenshot({ path: 'tests/screenshots/success.png', fullPage: true })
    console.log('📸 Screenshot saved: success.png')
    
    // Verify registration number format
    expect(regNumber).toMatch(/SPMB-\d{4}-\d{4}/)
    
    console.log('✅ ✅ ✅ REGISTRATION COMPLETE! ✅ ✅ ✅')
  })

  test('should show validation errors for empty required fields', async ({ page }) => {
    await page.goto('http://localhost:3000/signup')
    
    // Try to go to next step without filling required fields
    await page.click('button:has-text("Selanjutnya")')
    
    // Browser validation should prevent moving forward
    // Check that we're still on step 1
    await expect(page.locator('text=Data Siswa')).toBeVisible()
  })

  test('submit button should be disabled without checkbox', async ({ page }) => {
    await page.goto('http://localhost:3000/signup')
    
    // Fill all steps quickly (minimal data)
    await page.fill('input[name="namaLengkap"]', 'Test User')
    await page.fill('input[name="tempatLahir"]', 'Jakarta')
    await page.fill('input[name="tanggalLahir"]', '2010-01-01')
    await page.selectOption('select[name="jenisKelamin"]', 'Laki-laki')
    await page.fill('textarea[name="alamatLengkap"]', 'Test Address')
    await page.fill('input[name="noHP"]', '081234567890')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.click('button:has-text("Selanjutnya")')
    
    await page.fill('input[name="namaAyah"]', 'Test Ayah')
    await page.fill('input[name="pekerjaanAyah"]', 'Test')
    await page.fill('input[name="namaIbu"]', 'Test Ibu')
    await page.fill('input[name="pekerjaanIbu"]', 'Test')
    await page.fill('input[name="noHPOrangtua"]', '082345678901')
    await page.click('button:has-text("Selanjutnya")')
    
    await page.fill('input[name="asalSekolah"]', 'SD Test')
    await page.fill('input[name="alamatSekolah"]', 'Test')
    await page.click('button:has-text("Selanjutnya")')
    
    await page.click('button:has-text("Selanjutnya")')
    
    // Now on confirmation page
    const submitButton = page.locator('button:has-text("Kirim Pendaftaran")')
    
    // Button should be disabled
    await expect(submitButton).toBeDisabled()
    
    // Click checkbox
    await page.click('input[type="checkbox"]#persetujuan')
    
    // Button should now be enabled
    await expect(submitButton).toBeEnabled()
  })
})


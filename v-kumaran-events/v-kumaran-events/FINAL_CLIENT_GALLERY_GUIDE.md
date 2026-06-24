# V. Kumaran Decors & Events - Gallery Management Guide

Welcome to your new **Cloudinary-Powered Auto-Updating Gallery System**! 

With this system, you no longer need a developer, code edits, GitHub, or Netlify redeployments to update your website's portfolio. You simply manage your photos in Cloudinary, and your website will update **automatically**!

---

## 🛠️ Step 1: One-Time Cloudinary Setup

To allow your website to securely fetch your photos without exposing your passwords, you need to enable **public resource listing** in your Cloudinary account. This is a quick, one-time setup:

1. **Log in** to your [Cloudinary Console](https://cloudinary.com).
2. Click on the **Settings (gear icon)** at the bottom-left corner of the dashboard.
3. Click on the **Security** tab from the left sidebar.
4. Scroll down to the **Restricted media types** section.
5. **Uncheck** the box next to **Resource list**.
6. Click **Save** at the bottom of the page.

---

## 📂 Step 2: Folder Structure & Organization

In your Cloudinary Media Library, you should organize your photos inside folders. To keep the website organized, you must create folders with **EXACTLY** these names:

1. `Entrance Gate`
2. `Welcome Entrance`
3. `Hall Decoration`
4. `Reception Stage`
5. `Wedding Decor`
6. `Garland`
7. `Aarthi Plates`
8. `Birthday`
9. `Welcome Girls`
10. `Photo Booth`
11. `Bouncers`
12. `Car Decoration`

If you upload a photo to the `Welcome Entrance` folder, the website will automatically place it under the "Welcome Entrance" category!

---

## 🏷️ Step 3: Automatically Tagging Your Images

The website only displays images that have the tag `kumaran-gallery` assigned to them. You can configure Cloudinary to tag your uploads automatically:

### Option A: Set Up an Upload Preset (Recommended & Easiest)
This makes it so any image uploaded to your Media Library is automatically tagged:
1. Go to Cloudinary **Settings > Upload**.
2. Scroll to the **Upload presets** section and click **Add upload preset**.
3. Set **Mode** to **Unsigned**.
4. In the **Tags** field, type `kumaran-gallery` and press enter.
5. Save the preset.
6. Scroll down to **Media Library folder upload presets** and map your folders to use this new preset. Now, every photo you upload inside those folders will automatically get the `kumaran-gallery` tag!

### Option B: Manually Tagging Images
If you do not want to set up presets, you can tag them manually:
1. Right-click on any image in Cloudinary.
2. Select **Edit Metadata** or **Manage Tags**.
3. Add the tag `kumaran-gallery` and save.

---

## 📸 Daily Workflow

### How to Add a Photo
1. Open your Cloudinary Media Library.
2. Go into the folder corresponding to the category you want (e.g., `Birthday`).
3. Upload your photo.
4. (If using Option A, you are done! If using Option B, add the `kumaran-gallery` tag).
5. Open your website. Your photo will appear in about 60 seconds (due to Cloudinary CDN caching).

### How to Remove a Photo
1. Open your Cloudinary Media Library.
2. Find the photo you want to remove.
3. Delete the photo (or remove the `kumaran-gallery` tag).
4. The photo will automatically disappear from your website!

---

## 🔒 Failsafe Security & Offline Protection

- **No Passwords Exposed**: Your secret keys are kept completely safe. The website only uses public URLs to view the images.
- **Offline Protection**: If Cloudinary is ever down or if you haven't uploaded your images yet, the website is built with a **failsafe** that keeps displaying your original 43 beautiful portfolio images directly from the local server. Your website will **never** display blank spaces or broken files.

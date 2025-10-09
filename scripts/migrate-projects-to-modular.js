#!/usr/bin/env node

/**
 * Migration Script: Projects to Modular Structure
 * 
 * This script restructures projects from:
 *   projects/posts/project-name.md
 * To:
 *   projects/posts/project-name/index.md
 *   projects/posts/project-name/assets/
 * 
 * Run: node scripts/migrate-projects-to-modular.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const POSTS_DIR = path.join(__dirname, '../projects/posts');
const BACKUP_DIR = path.join(__dirname, '../projects/posts-backup');
const IMAGES_DIR = path.join(__dirname, '../projects/images');

// Projects to migrate
const PROJECTS = [
    'api-gateway',
    'mobile-fitness-app',
    'real-time-dashboard',
    'saas-platform'
];

console.log('🚀 Starting projects migration to modular structure...\n');

// Step 1: Create backup
console.log('📦 Creating backup...');
if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// Step 2: Migrate each project
PROJECTS.forEach((slug) => {
    console.log(`\n📁 Processing: ${slug}`);
    
    const oldFilePath = path.join(POSTS_DIR, `${slug}.md`);
    
    // Check if file exists
    if (!fs.existsSync(oldFilePath)) {
        console.log(`   ⚠️  Warning: ${slug}.md not found, skipping...`);
        return;
    }
    
    // Create backup
    const backupPath = path.join(BACKUP_DIR, `${slug}.md`);
    fs.copyFileSync(oldFilePath, backupPath);
    console.log(`   ✓ Backed up to: ${path.relative(process.cwd(), backupPath)}`);
    
    // Create new directory structure
    const newProjectDir = path.join(POSTS_DIR, slug);
    const newAssetsDir = path.join(newProjectDir, 'assets');
    
    if (!fs.existsSync(newProjectDir)) {
        fs.mkdirSync(newProjectDir, { recursive: true });
    }
    if (!fs.existsSync(newAssetsDir)) {
        fs.mkdirSync(newAssetsDir, { recursive: true });
    }
    
    console.log(`   ✓ Created directory: ${path.relative(process.cwd(), newProjectDir)}`);
    console.log(`   ✓ Created assets directory: ${path.relative(process.cwd(), newAssetsDir)}`);
    
    // Move markdown file
    const newFilePath = path.join(newProjectDir, 'index.md');
    fs.renameSync(oldFilePath, newFilePath);
    console.log(`   ✓ Moved markdown to: ${path.relative(process.cwd(), newFilePath)}`);
    
    // Create .gitkeep in assets folder
    const gitkeepPath = path.join(newAssetsDir, '.gitkeep');
    fs.writeFileSync(gitkeepPath, '');
    console.log(`   ✓ Created .gitkeep in assets folder`);
    
    console.log(`   ✅ Successfully migrated ${slug}`);
});

// Step 3: Handle shared project images
console.log(`\n🖼️  Checking for shared images...`);
if (fs.existsSync(IMAGES_DIR)) {
    const images = fs.readdirSync(IMAGES_DIR);
    if (images.length > 0) {
        console.log(`   📸 Found ${images.length} image(s) in projects/images/:`);
        images.forEach(img => {
            console.log(`      - ${img}`);
        });
        console.log(`\n   ⚠️  Manual action required:`);
        console.log(`      Move these images to the appropriate project's assets/ folder`);
        console.log(`      Or keep them if they're shared across multiple projects`);
    } else {
        console.log(`   ✓ No shared images found`);
    }
}

// Step 4: Migrate template
console.log(`\n📝 Processing template...`);
const oldTemplatePath = path.join(__dirname, '../projects/template.md');
const newTemplateDir = path.join(__dirname, '../projects/template');
const newTemplatePath = path.join(newTemplateDir, 'index.md');

if (fs.existsSync(oldTemplatePath)) {
    // Backup template
    const templateBackup = path.join(BACKUP_DIR, 'template.md');
    fs.copyFileSync(oldTemplatePath, templateBackup);
    console.log(`   ✓ Backed up template`);
    
    // Create template directory
    if (!fs.existsSync(newTemplateDir)) {
        fs.mkdirSync(newTemplateDir, { recursive: true });
    }
    
    const templateAssetsDir = path.join(newTemplateDir, 'assets');
    if (!fs.existsSync(templateAssetsDir)) {
        fs.mkdirSync(templateAssetsDir, { recursive: true });
    }
    
    // Move template
    fs.renameSync(oldTemplatePath, newTemplatePath);
    console.log(`   ✓ Moved template to: ${path.relative(process.cwd(), newTemplatePath)}`);
    
    // Create .gitkeep
    fs.writeFileSync(path.join(templateAssetsDir, '.gitkeep'), '');
    
    console.log(`   ✅ Successfully migrated template`);
}

console.log('\n✨ Projects migration complete!');
console.log(`\n📋 Summary:`);
console.log(`   - Migrated ${PROJECTS.length} projects`);
console.log(`   - Created modular directory structure`);
console.log(`   - Backups saved to: ${path.relative(process.cwd(), BACKUP_DIR)}`);
console.log(`\n⚠️  Next steps:`);
console.log(`   1. Review the new structure in projects/posts/`);
console.log(`   2. Move any related images to respective assets/ folders`);
console.log(`   3. Update image paths in markdown files (from absolute to relative)`);
console.log(`   4. Update build script: node scripts/build-content.js`);
console.log(`   5. Test the site to ensure all images load correctly`);

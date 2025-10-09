#!/usr/bin/env node

/**
 * Migration Script: Blog Posts to Modular Structure
 * 
 * This script restructures blog posts from:
 *   blog/posts/post-name.md
 * To:
 *   blog/posts/post-name/index.md
 *   blog/posts/post-name/assets/
 * 
 * Run: node scripts/migrate-blog-to-modular.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const POSTS_DIR = path.join(__dirname, '../content/blog/posts');
const BACKUP_DIR = path.join(__dirname, '../content/blog/posts-backup');

// Blog posts to migrate
const BLOG_POSTS = [
    'unemployed-to-saas-founder',
    'building-scalable-systems',
    'my-saas-tech-stack'
];

console.log('🚀 Starting blog migration to modular structure...\n');

// Step 1: Create backup
console.log('📦 Creating backup...');
if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// Step 2: Migrate each post
BLOG_POSTS.forEach((slug) => {
    console.log(`\n📝 Processing: ${slug}`);
    
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
    const newPostDir = path.join(POSTS_DIR, slug);
    const newAssetsDir = path.join(newPostDir, 'assets');
    
    if (!fs.existsSync(newPostDir)) {
        fs.mkdirSync(newPostDir, { recursive: true });
    }
    if (!fs.existsSync(newAssetsDir)) {
        fs.mkdirSync(newAssetsDir, { recursive: true });
    }
    
    console.log(`   ✓ Created directory: ${path.relative(process.cwd(), newPostDir)}`);
    console.log(`   ✓ Created assets directory: ${path.relative(process.cwd(), newAssetsDir)}`);
    
    // Move markdown file
    const newFilePath = path.join(newPostDir, 'index.md');
    fs.renameSync(oldFilePath, newFilePath);
    console.log(`   ✓ Moved markdown to: ${path.relative(process.cwd(), newFilePath)}`);
    
    // Create .gitkeep in assets folder
    const gitkeepPath = path.join(newAssetsDir, '.gitkeep');
    fs.writeFileSync(gitkeepPath, '');
    console.log(`   ✓ Created .gitkeep in assets folder`);
    
    console.log(`   ✅ Successfully migrated ${slug}`);
});

// Step 3: Migrate template
console.log(`\n📝 Processing template...`);
const oldTemplatePath = path.join(__dirname, '../content/blog/template.md');
const newTemplateDir = path.join(__dirname, '../content/blog/template');
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

console.log('\n✨ Blog migration complete!');
console.log(`\n📋 Summary:`);
console.log(`   - Migrated ${BLOG_POSTS.length} blog posts`);
console.log(`   - Created modular directory structure`);
console.log(`   - Backups saved to: ${path.relative(process.cwd(), BACKUP_DIR)}`);
console.log(`\n⚠️  Next steps:`);
console.log(`   1. Review the new structure in blog/posts/`);
console.log(`   2. Move any related images to respective assets/ folders`);
console.log(`   3. Update image paths in markdown files (from absolute to relative)`);
console.log(`   4. Run: node scripts/migrate-projects-to-modular.js`);
console.log(`   5. Update build script: node scripts/build-content.js`);

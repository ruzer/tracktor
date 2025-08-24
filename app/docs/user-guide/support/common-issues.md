# Common Issues and Solutions

Comprehensive solutions to frequently encountered problems with Tracktor. Each issue includes symptoms, causes, and step-by-step solutions.

## Installation Issues

### Docker Installation Problems

#### Issue: "Port 3000 already in use"

**Symptoms:**

- Error message when starting Docker container
- Cannot access Tracktor at localhost:3000
- Docker container fails to start

**Causes:**

- Another application is using port 3000
- Previous Tracktor instance still running
- System service occupying the port

**Solutions:**

**Option 1: Use Different Port**

```bash
# Run Tracktor on port 3001 instead
docker run -p 3001:3000 -d tracktor

# For Docker Compose, edit docker-compose.yml:
# ports:
#   - "3001:3000"
```

**Option 2: Stop Conflicting Service**

```bash
# Find what's using port 3000
lsof -i :3000

# Stop the conflicting process (replace PID with actual process ID)
kill -9 [PID]

# Or stop previous Tracktor container
docker stop $(docker ps -q --filter ancestor=tracktor)
```

**Option 3: System-Specific Solutions**

```bash
# On macOS, check for AirPlay Receiver
# System Preferences → Sharing → AirPlay Receiver (disable)

# On Windows, check for IIS or other web servers
# Services → World Wide Web Publishing Service (stop)
```

#### Issue: Docker Permission Denied

**Symptoms:**

- "Permission denied" errors when running Docker commands
- Cannot build or run Docker containers
- Access denied to Docker daemon

**Solutions:**

**Linux/macOS:**

```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Log out and back in, or run:
newgrp docker

# Alternative: Use sudo (not recommended for regular use)
sudo docker-compose up -d
```

**Windows:**

- Ensure Docker Desktop is running as administrator
- Check Windows Subsystem for Linux (WSL) permissions
- Restart Docker Desktop service

#### Issue: Docker Build Fails

**Symptoms:**

- Build process stops with errors
- Missing dependencies or files
- Network connectivity issues during build

**Solutions:**

**Check Docker Version:**

```bash
# Ensure Docker version is compatible
docker --version
docker-compose --version

# Update if necessary
```

**Clean Build:**

```bash
# Remove existing images and rebuild
docker system prune -a
docker-compose build --no-cache
```

**Network Issues:**

```bash
# If behind corporate firewall, configure proxy
# Add to Dockerfile:
# ENV HTTP_PROXY=http://proxy.company.com:8080
# ENV HTTPS_PROXY=http://proxy.company.com:8080
```

### Manual Installation Problems

#### Issue: Node.js Version Incompatibility

**Symptoms:**

- Installation fails with version errors
- npm install produces compatibility warnings
- Application won't start due to Node.js version

**Solutions:**

**Check and Update Node.js:**

```bash
# Check current version
node --version

# Should be 18.0.0 or higher
# Update using Node Version Manager (nvm)
nvm install 18
nvm use 18

# Or download from nodejs.org
```

**Clear npm Cache:**

```bash
# Clear npm cache if installation fails
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Issue: npm Install Fails

**Symptoms:**

- Package installation errors
- Network timeouts during installation
- Permission errors with global packages

**Solutions:**

**Network Issues:**

```bash
# Configure npm registry
npm config set registry https://registry.npmjs.org/

# If behind firewall, configure proxy
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080
```

**Permission Issues:**

```bash
# Fix npm permissions (Linux/macOS)
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules

# Or use nvm to avoid permission issues
```

**Dependency Conflicts:**

```bash
# Force install if peer dependency warnings
npm install --legacy-peer-deps

# Or use exact versions
npm ci
```

#### Issue: Build Process Fails

**Symptoms:**

- npm run build fails with errors
- TypeScript compilation errors
- Missing environment variables

**Solutions:**

**Environment Setup:**

```bash
# Ensure environment is set up
npm run setup

# Check if .env files exist
ls -la .env*

# Copy example environment file if needed
cp .env.example .env
```

**TypeScript Issues:**

```bash
# Clear TypeScript cache
npx tsc --build --clean

# Reinstall TypeScript
npm install -g typescript@latest
```

## Login and Authentication

### PIN Authentication Issues

#### Issue: Cannot Set Initial PIN

**Symptoms:**

- PIN setup form doesn't respond
- Error messages when creating PIN
- Stuck on PIN creation screen

**Causes:**

- Browser blocking local storage
- JavaScript disabled
- Conflicting browser extensions
- Corrupted browser data

**Solutions:**

**Browser Settings Check:**

1. **Enable JavaScript:**
   - Chrome: Settings → Privacy and Security → Site Settings → JavaScript (Allow)
   - Firefox: about:config → javascript.enabled (true)
   - Safari: Preferences → Security → Enable JavaScript

2. **Allow Local Storage:**
   - Chrome: Settings → Privacy and Security → Site Settings → Cookies and site data (Allow)
   - Firefox: Settings → Privacy & Security → Cookies and Site Data (Accept)

3. **Disable Conflicting Extensions:**
   - Try incognito/private browsing mode
   - Disable ad blockers and privacy extensions temporarily
   - Test with extensions disabled

**Clear Browser Data:**

```bash
# Chrome: Settings → Privacy and Security → Clear browsing data
# Select: Cookies, Cached images, Local storage
# Time range: All time

# Firefox: Settings → Privacy & Security → Clear Data
# Select: Cookies, Cache, Site Data

# Safari: Preferences → Privacy → Manage Website Data → Remove All
```

#### Issue: Forgotten PIN Recovery

**Symptoms:**

- Cannot remember PIN to access Tracktor
- No password recovery option available
- Locked out of application

**Solutions:**

**Browser Storage Reset:**

> **⚠️ Warning:** This will delete all your Tracktor data stored in the browser.

```bash
# Method 1: Clear site data through browser
# Chrome: Settings → Privacy and Security → Site Settings →
# View permissions and data stored across sites →
# Find localhost:3000 → Clear data

# Method 2: Browser Developer Tools
# Press F12 → Application tab → Storage →
# Local Storage → Clear all
```

**Data Backup Before Reset:**
If you have important data, try to export it first:

1. Open browser developer tools (F12)
2. Go to Application → Local Storage
3. Copy data values to a text file
4. After PIN reset, you may be able to restore some data

**Prevention:**

- Write down your PIN in a secure location
- Use a PIN that's memorable but secure
- Consider regular data exports as backup

#### Issue: PIN Not Working After Setup

**Symptoms:**

- PIN was set successfully but now doesn't work
- "Invalid PIN" error with correct PIN
- Authentication fails intermittently

**Solutions:**

**Browser Cache Issues:**

```bash
# Clear browser cache and cookies
# Try hard refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)

# Clear specific site data:
# Chrome: Settings → Site Settings → localhost:3000 → Clear data
# Firefox: Settings → Privacy → Manage Data → Remove site data
```

**Keyboard Input Issues:**

- Check if Num Lock is on (for numeric keypad)
- Try typing PIN in a text editor first to verify keys work
- Check for stuck keys or keyboard issues
- Try on-screen keyboard if available

**Browser Compatibility:**

- Try different browser (Chrome, Firefox, Safari, Edge)
- Update browser to latest version
- Disable browser extensions temporarily

### Session Management Issues

#### Issue: Frequent Logouts

**Symptoms:**

- Automatically logged out after short periods
- Session expires unexpectedly
- Need to re-enter PIN frequently

**Causes:**

- Browser security settings
- Aggressive cookie/storage clearing
- Browser extensions interfering
- System sleep/hibernate affecting browser

**Solutions:**

**Browser Settings:**

- Disable automatic cookie clearing
- Add Tracktor to browser exceptions
- Adjust session timeout settings if available
- Keep browser tab active (don't close)

**System Settings:**

- Adjust power management settings
- Prevent system sleep during use
- Keep browser running in background

## Data Entry Problems

### Form Validation Errors

#### Issue: "Invalid Format" Errors

**Symptoms:**

- Form won't accept valid-looking data
- Validation errors for correct information
- Cannot save records due to format issues

**Common Format Requirements:**

**License Plate Format:**

- **Allowed:** Letters, numbers, spaces, hyphens
- **Length:** 2-25 characters
- **Example:** "ABC-123", "CA 1234567"
- **Invalid:** Special characters like @, #, $

**VIN Format:**

- **Length:** 17 characters
- **Allowed:** Letters and numbers (excludes I, O, Q)
- **Example:** "1HGBH41JXMN109186"
- **Invalid:** Too short/long, contains I/O/Q

**Date Format:**

- **Format:** YYYY-MM-DD or use date picker
- **Valid range:** Reasonable dates (not future for past events)
- **Example:** "2024-03-15"

**Solutions:**

1. **Use exact formats** as specified in field hints
2. **Copy-paste carefully** - avoid extra spaces or characters
3. **Use date pickers** instead of manual date entry
4. **Check field requirements** - hover over fields for format hints

#### Issue: Odometer Reading Validation

**Symptoms:**

- "Odometer must be greater than previous reading" error
- Cannot enter lower odometer reading
- Validation prevents legitimate entries

**Causes:**

- Trying to enter reading lower than previous entries
- Previous incorrect entry affecting validation
- Misunderstanding of odometer progression

**Solutions:**

**Check Previous Entries:**

1. Review recent fuel logs or maintenance records
2. Find the highest odometer reading in your records
3. Ensure new reading is higher than the highest previous reading

**Correct Previous Errors:**

1. Edit previous entries if they contain errors
2. Update incorrect odometer readings
3. Ensure chronological progression makes sense

**Handle Special Cases:**

- **Odometer rollover:** Contact support for vehicles with rolled-over odometers
- **Replacement odometer:** Note in comments when odometer is replaced
- **Different units:** Ensure consistent use of miles vs. kilometers

#### Issue: Cost and Number Validation

**Symptoms:**

- Cannot enter decimal numbers
- "Must be greater than 0" errors for valid amounts
- Number format not accepted

**Solutions:**

**Decimal Numbers:**

- Use period (.) for decimal point, not comma
- Example: "45.67" not "45,67"
- Avoid currency symbols ($, €, etc.)

**Positive Numbers:**

- All costs and amounts must be greater than 0
- Use "0.01" for very small amounts, not "0"
- Check for negative signs accidentally entered

**Large Numbers:**

- Don't use thousands separators (commas)
- Example: "12345.67" not "12,345.67"
- System handles display formatting automatically

### Data Import/Export Issues

#### Issue: Cannot Export Data

**Symptoms:**

- Export function not working
- Empty or corrupted export files
- Browser blocks file downloads

**Solutions:**

**Browser Download Settings:**

- Check if browser is blocking downloads
- Allow downloads from Tracktor domain
- Check download folder permissions

**Data Export Process:**

1. Ensure you have data to export
2. Select appropriate date ranges
3. Choose correct export format
4. Wait for export to complete before closing browser

#### Issue: Data Loss or Corruption

**Symptoms:**

- Records disappear unexpectedly
- Data appears corrupted or incorrect
- Cannot access previously entered information

**Immediate Actions:**

1. **Don't enter new data** until issue is resolved
2. **Check browser storage** - data might still be there
3. **Try different browser** - data might be browser-specific
4. **Check for backups** - recent exports or screenshots

**Recovery Steps:**

1. Clear browser cache and reload
2. Check browser developer tools for storage data
3. Try accessing from different device/browser
4. Contact community for data recovery assistance

**Prevention:**

- Regular data exports (weekly/monthly)
- Screenshot important records
- Use multiple browsers occasionally to verify data
- Keep backup copies of critical information

## Performance Issues

### Slow Loading and Response

#### Issue: Application Loads Slowly

**Symptoms:**

- Long loading times when accessing Tracktor
- Slow response to clicks and interactions
- Pages take long time to display

**Causes:**

- Slow internet connection
- Browser performance issues
- Large amount of stored data
- Outdated browser or system

**Solutions:**

**Network Optimization:**

- Check internet connection speed
- Close other bandwidth-intensive applications
- Use wired connection instead of Wi-Fi if possible
- Try accessing during off-peak hours

**Browser Optimization:**

```bash
# Clear browser cache and cookies
# Close unnecessary browser tabs
# Restart browser
# Update browser to latest version
```

**System Optimization:**

- Close unnecessary applications
- Restart computer if performance is generally slow
- Check available disk space (need at least 1GB free)
- Update operating system

#### Issue: Interface Freezing or Hanging

**Symptoms:**

- Interface becomes unresponsive
- Buttons don't respond to clicks
- Browser tab shows "Not Responding"

**Immediate Solutions:**

1. **Wait 30 seconds** - sometimes operations just take time
2. **Refresh the page** - Ctrl+F5 or Cmd+Shift+R
3. **Close and reopen tab** - preserve other browser tabs
4. **Restart browser** - if entire browser is affected

**Diagnostic Steps:**

1. **Check browser console** (F12 → Console) for error messages
2. **Monitor system resources** - Task Manager (Windows) or Activity Monitor (Mac)
3. **Test with different browser** - isolate browser-specific issues
4. **Try incognito mode** - test without extensions

### Memory and Storage Issues

#### Issue: "Storage Quota Exceeded" Errors

**Symptoms:**

- Cannot save new records
- Error messages about storage limits
- Application warns about storage space

**Solutions:**

**Clear Browser Storage:**

```bash
# Chrome: Settings → Privacy and Security → Site Settings →
# Storage → localhost:3000 → Clear data

# Firefox: Settings → Privacy & Security →
# Cookies and Site Data → Manage Data → Remove site data
```

**Data Management:**

1. **Export old data** before clearing storage
2. **Delete unnecessary records** - old test entries, duplicates
3. **Archive old data** - export and remove very old records
4. **Use external storage** - export data regularly for backup

**Browser Settings:**

- Increase storage quota if browser allows
- Check available disk space on computer
- Clear other websites' data to free up browser storage

#### Issue: High Memory Usage

**Symptoms:**

- Computer becomes slow when using Tracktor
- Browser uses excessive RAM
- System performance degrades

**Solutions:**

**Browser Management:**

- Close unnecessary browser tabs
- Restart browser periodically
- Use browser task manager to identify memory-heavy tabs
- Consider using different browser for Tracktor

**System Management:**

- Close unnecessary applications
- Restart computer regularly
- Check for memory leaks in other applications
- Consider upgrading RAM if consistently insufficient

## Browser Compatibility

### Browser-Specific Issues

#### Issue: Features Not Working in Specific Browser

**Symptoms:**

- Some buttons or features don't work
- Interface appears broken or misaligned
- JavaScript errors in browser console

**Browser Support:**

- **Recommended:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Minimum:** Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **Not supported:** Internet Explorer, very old browser versions

**Solutions:**

**Update Browser:**

```bash
# Chrome: Settings → About Chrome (auto-updates)
# Firefox: Help → About Firefox (auto-updates)
# Safari: System Preferences → Software Update (macOS)
# Edge: Settings → About Microsoft Edge (auto-updates)
```

**Enable Required Features:**

- JavaScript must be enabled
- Cookies and local storage must be allowed
- Pop-up blockers should allow Tracktor domain

**Test Alternative Browsers:**

- Try Chrome if using Firefox
- Try Firefox if using Chrome
- Use Edge or Safari as alternatives
- Test in incognito/private mode

#### Issue: Mobile Browser Problems

**Symptoms:**

- Interface doesn't fit mobile screen
- Touch interactions don't work properly
- Features missing on mobile

**Solutions:**

**Mobile Browser Settings:**

- Use latest version of mobile browser
- Enable JavaScript and cookies
- Clear mobile browser cache
- Try different mobile browser (Chrome, Firefox, Safari)

**Mobile-Specific Tips:**

- Use landscape orientation for better experience
- Zoom out if interface appears too large
- Use native browser instead of in-app browsers
- Ensure stable internet connection

**Alternative Access:**

- Use desktop/laptop when possible for full features
- Access via tablet for better mobile experience
- Consider using mobile-optimized features only

### JavaScript and Security Issues

#### Issue: JavaScript Errors

**Symptoms:**

- Error messages in browser console
- Features not working properly
- "Script error" notifications

**Solutions:**

**Enable JavaScript:**

- Ensure JavaScript is enabled in browser settings
- Check if security software is blocking JavaScript
- Disable JavaScript-blocking browser extensions

**Security Settings:**

- Add Tracktor to browser security exceptions
- Disable strict security modes temporarily
- Check if corporate firewall is blocking scripts

**Extension Conflicts:**

- Disable ad blockers and privacy extensions
- Test in incognito mode without extensions
- Re-enable extensions one by one to identify conflicts

## Getting Additional Help

### When to Seek Community Support

**Seek help when:**

- Issue persists after trying documented solutions
- Error messages not covered in this guide
- Unusual behavior that doesn't match known issues
- Data loss or corruption concerns

### How to Report Issues Effectively

**Include in your report:**

1. **Detailed description** of the problem
2. **Steps to reproduce** the issue
3. **Expected vs. actual behavior**
4. **Browser and version** (Chrome 120, Firefox 115, etc.)
5. **Operating system** (Windows 11, macOS 14, Ubuntu 22.04)
6. **Screenshots or error messages**
7. **Console errors** (F12 → Console tab)

**Example good bug report:**

```
Title: Cannot save fuel log entry - validation error

Description: When trying to save a fuel log entry, I get a validation
error saying "Odometer must be greater than previous reading" even
though my new reading (45,580) is higher than my last entry (45,230).

Steps to reproduce:
1. Go to Fuel tab
2. Click "Add Fuel Log"
3. Enter date: 2024-03-15
4. Enter odometer: 45,580
5. Enter fuel amount: 12.3
6. Enter cost: 42.15
7. Click Save

Expected: Fuel log should save successfully
Actual: Error message appears and entry is not saved

Browser: Chrome 120.0.6099.109
OS: Windows 11
Console errors: [attach screenshot of console]
```

### Community Resources

- **[GitHub Issues](https://github.com/javedh-dev/tracktor/issues)** - Bug reports and feature requests
- **[GitHub Discussions](https://github.com/javedh-dev/tracktor/discussions)** - Community help and questions
- **[Documentation](/user-guide/)** - Complete user guides and tutorials

Remember: The community is here to help, and your questions help improve Tracktor for everyone!

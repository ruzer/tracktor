# Frequently Asked Questions

Quick answers to the most common questions about Tracktor. Can't find what you're looking for? Check the [troubleshooting guide](./common-issues.md) or ask the community.

## General Questions

### What is Tracktor?

**Tracktor is a comprehensive, open-source vehicle management platform** that helps you track and organize all aspects of vehicle ownership in one place.

**Key capabilities:**

- **Vehicle Management** - Store detailed information for multiple vehicles
- **Fuel Tracking** - Monitor fuel consumption, efficiency, and costs
- **Maintenance Logs** - Keep complete service history and schedule future maintenance
- **Insurance Management** - Track policies, renewals, and coverage details
- **PUCC/Emissions** - Manage pollution certificates and compliance requirements

**Who it's for:**

- Individual vehicle owners who want comprehensive tracking
- Families managing multiple vehicles
- Small businesses with vehicle fleets
- Anyone who wants to optimize vehicle costs and maintenance

### How do I get started?

**Quick start process (15-30 minutes):**

1. **[Install Tracktor](/user-guide/getting-started/installation.md)** using Docker (recommended) or manual installation
2. **[Complete first setup](/user-guide/getting-started/first-setup.md)** - create your PIN and configure preferences
3. **[Add your first vehicle](/user-guide/tutorials/adding-first-vehicle.md)** with basic information
4. **Start logging data** - add a fuel purchase or maintenance record
5. **Explore features** - discover what Tracktor can do for your vehicles

**What you'll need:**

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Vehicle information (make, model, year, license plate)
- Current odometer reading
- About 30 minutes for complete setup

### Is Tracktor free to use?

**Yes, Tracktor is completely free and open-source.**

**What this means:**

- **No cost** - Free to download, install, and use
- **No subscriptions** - No recurring fees or premium tiers
- **No ads** - Clean interface without advertisements
- **Open source** - Source code is publicly available on GitHub
- **Community-driven** - Developed and maintained by the community

**Costs you might have:**

- **Hosting costs** if you deploy to cloud services (optional)
- **Your time** for installation and setup
- **Hardware** if you need to upgrade your system (rare)

### What data does Tracktor collect?

**Tracktor is privacy-focused and collects minimal data.**

**Data stored locally:**

- **Vehicle information** - Make, model, year, license plate, etc.
- **Fuel logs** - Purchase dates, amounts, costs, odometer readings
- **Maintenance records** - Service dates, costs, service providers
- **Insurance policies** - Policy details, renewal dates, costs
- **PUCC certificates** - Certificate numbers, dates, testing centers

**Data NOT collected:**

- **Personal information** - No names, addresses, or contact details required
- **Location data** - No GPS tracking or location monitoring
- **Usage analytics** - No tracking of how you use the application
- **External data** - No integration with third-party services without your consent

**Data storage:**

- **Local storage** - Data stored in your browser or local installation
- **No cloud sync** - Data stays on your device unless you export it
- **Your control** - You own and control all your data

### Can I use Tracktor for multiple vehicles?

**Yes, Tracktor is designed to handle multiple vehicles efficiently.**

**Multi-vehicle features:**

- **Unlimited vehicles** - Add as many vehicles as you need
- **Individual tracking** - Separate records for each vehicle
- **Comparative analytics** - Compare efficiency and costs across vehicles
- **Unified dashboard** - See all vehicles in one place
- **Cross-vehicle reporting** - Combined reports and analysis

**Use cases:**

- **Family vehicles** - Track cars for different family members
- **Multiple personal vehicles** - Cars, motorcycles, trucks, RVs
- **Small business fleets** - Commercial vehicles and equipment
- **Vehicle enthusiasts** - Classic cars, project vehicles, daily drivers

**Organization features:**

- **Vehicle identification** - Colors, photos, and custom details
- **Separate maintenance schedules** - Individual service needs
- **Independent insurance tracking** - Different policies per vehicle
- **Flexible reporting** - View data by vehicle or combined

### How accurate are the fuel efficiency calculations?

**Tracktor's fuel efficiency calculations are highly accurate when used properly.**

**Calculation method:**

- **Distance-based** - Uses odometer readings between fuel-ups
- **Actual consumption** - Based on fuel actually purchased
- **Real-world accuracy** - Reflects your actual driving conditions
- **Automatic calculation** - No manual input required

**Factors affecting accuracy:**

- **Complete fuel-ups** - Fill tank completely each time for best accuracy
- **Accurate odometer readings** - Critical for distance calculations
- **Consistent logging** - Don't skip fuel purchases
- **Proper timing** - Log fuel purchases promptly

**Typical accuracy:**

- **±2-5%** with proper logging habits
- **±5-10%** with occasional incomplete data
- **Improves over time** as more data is collected
- **Better than manual calculations** due to consistent methodology

**Tips for maximum accuracy:**

- Always fill tank completely
- Record exact odometer readings
- Log every fuel purchase
- Use same gas stations when possible (consistent pump calibration)

## Features and Functionality

### What's the difference between fuel tracking and maintenance logs?

**Fuel Tracking focuses on consumption and efficiency:**

- **Purpose** - Monitor fuel consumption, efficiency, and costs
- **Data** - Fuel purchases, amounts, costs, odometer readings
- **Calculations** - Miles per gallon, cost per mile, efficiency trends
- **Frequency** - Every fuel purchase (weekly to monthly typically)
- **Benefits** - Optimize fuel costs, monitor vehicle performance

**Maintenance Logs focus on service and repairs:**

- **Purpose** - Track service history and schedule future maintenance
- **Data** - Service dates, work performed, costs, service providers
- **Tracking** - Maintenance intervals, service quality, cost trends
- **Frequency** - As maintenance is performed (monthly to annually)
- **Benefits** - Prevent breakdowns, maintain warranty, optimize service costs

**How they work together:**

- **Odometer synchronization** - Both use odometer readings for timing
- **Performance correlation** - Maintenance affects fuel efficiency
- **Cost analysis** - Combined view of total vehicle ownership costs
- **Scheduling** - Fuel data helps determine maintenance intervals

### Can I import data from other applications?

**Currently, Tracktor doesn't have built-in import functionality, but there are workarounds.**

**Manual data entry:**

- **Gradual entry** - Add historical data over time
- **Priority data** - Start with most recent and important records
- **Batch entry** - Set aside time to enter multiple records at once

**Preparation for future import:**

- **Export from current system** - Save data in CSV or spreadsheet format
- **Organize data** - Structure according to Tracktor's data fields
- **Clean data** - Remove duplicates and fix formatting issues

**Community solutions:**

- **Import scripts** - Community members may develop import tools
- **Data conversion** - Help available in GitHub Discussions
- **Feature requests** - Import functionality is being considered for future versions

**What you can import manually:**

- Vehicle information and specifications
- Historical fuel purchase records
- Maintenance and service history
- Insurance policy information
- PUCC/emission certificate records

### How do I backup my data?

**Tracktor provides several ways to protect your data.**

**Export functionality:**

- **CSV export** - Export data to spreadsheet format
- **Date ranges** - Export specific time periods
- **Selective export** - Choose which data to include
- **Regular exports** - Set up routine backup schedule

**Browser-based backup:**

- **Browser sync** - Some browsers sync local storage across devices
- **Manual backup** - Copy browser storage data
- **Multiple browsers** - Use Tracktor in different browsers as backup

**Best practices:**

- **Weekly exports** - Export data weekly for active users
- **Monthly exports** - Minimum recommended backup frequency
- **Before updates** - Always backup before updating Tracktor
- **Multiple locations** - Store backups in different locations (cloud, USB, etc.)

**Backup schedule example:**

- **Daily** - For heavy users with critical data
- **Weekly** - For regular users with important records
- **Monthly** - For occasional users with basic tracking
- **Before changes** - Always backup before major updates or changes

### Can I access Tracktor from my phone?

**Yes, Tracktor works on mobile devices with some considerations.**

**Mobile compatibility:**

- **Responsive design** - Interface adapts to mobile screens
- **Touch-friendly** - Buttons and forms work with touch input
- **Mobile browsers** - Works in Chrome, Firefox, Safari mobile
- **Cross-device** - Access same data from phone, tablet, computer

**Mobile experience:**

- **Full functionality** - All features available on mobile
- **Optimized layouts** - Interface adjusts for smaller screens
- **Touch interactions** - Swipe, tap, and pinch gestures supported
- **Offline capability** - Works without internet after initial load

**Mobile limitations:**

- **Screen size** - Some features easier on larger screens
- **Data entry** - Typing easier on physical keyboard
- **Complex operations** - Detailed analysis better on desktop
- **Performance** - May be slower on older mobile devices

**Mobile tips:**

- **Landscape mode** - Use landscape orientation for better experience
- **Zoom as needed** - Pinch to zoom for detailed views
- **Bookmark** - Add to home screen for quick access
- **Stable connection** - Ensure good internet for initial loading

### What happens if I forget my PIN?

**Unfortunately, there's no PIN recovery system, but you have options.**

**Why no recovery:**

- **Security design** - PIN is used to encrypt your local data
- **Privacy protection** - No external accounts or email required
- **Local storage** - Data is stored locally, not on external servers

**Recovery options:**

**Option 1: Reset Application Data**

> **⚠️ Warning:** This will delete all your Tracktor data.

```bash
# Clear browser data for Tracktor:
# Chrome: Settings → Site Settings → localhost:3000 → Clear data
# Firefox: Settings → Privacy → Manage Data → Remove site data
# Safari: Preferences → Privacy → Manage Website Data → Remove
```

**Option 2: Try Common PINs**

- Think about PINs you commonly use
- Try variations of important dates or numbers
- Consider if you might have written it down somewhere

**Option 3: Browser Developer Tools**

- Advanced users can try accessing browser storage directly
- May be able to reset PIN without losing all data
- Requires technical knowledge of browser storage systems

**Prevention for future:**

- **Write down PIN** in secure location
- **Use memorable PIN** that you won't forget
- **Regular backups** - Export data regularly so loss is minimal
- **Multiple access points** - Use Tracktor on multiple devices/browsers

## Technical Questions

### What are the system requirements?

**Tracktor has minimal system requirements and runs on most modern systems.**

**Hardware requirements:**

- **Memory** - 512MB RAM minimum, 1GB recommended
- **Storage** - 500MB free disk space (includes data storage)
- **Processor** - Any modern processor (last 10 years)
- **Network** - Internet connection for initial setup and updates

**Software requirements:**

- **Operating System** - Windows 10+, macOS 10.14+, Linux (any modern distribution)
- **Web Browser** - Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **JavaScript** - Must be enabled in browser
- **Local Storage** - Browser must allow local storage and cookies

**Recommended setup:**

- **Browser** - Latest version of Chrome or Firefox
- **Memory** - 2GB+ RAM for smooth performance
- **Storage** - 1GB+ free space for data growth
- **Connection** - Broadband internet for best experience

**Docker requirements (if using Docker):**

- **Docker** - Version 20.10 or higher
- **Docker Compose** - Version 2.0 or higher (for multi-container setup)
- **Additional memory** - 1GB+ for Docker containers

### Is my data secure?

**Yes, Tracktor is designed with security and privacy as priorities.**

**Security features:**

- **Local storage** - Data stored on your device, not external servers
- **PIN protection** - Access controlled by your personal PIN
- **No external accounts** - No usernames, passwords, or email required
- **Open source** - Code is publicly auditable for security issues

**Data protection:**

- **Browser security** - Leverages browser's built-in security features
- **Local encryption** - Data protected by browser's storage security
- **No transmission** - Data doesn't leave your device unless you export it
- **No tracking** - No analytics or usage tracking

**Privacy benefits:**

- **No personal information required** - Use without providing personal details
- **No data sharing** - Your data is never shared with third parties
- **No cloud storage** - Data stays on your device
- **Complete control** - You own and control all your data

**Security best practices:**

- **Use strong PIN** - Choose secure but memorable PIN
- **Keep browser updated** - Use latest browser version for security patches
- **Secure device** - Protect the device where Tracktor is installed
- **Regular backups** - Export data regularly to prevent loss

### Can I run Tracktor on a server?

**Yes, Tracktor can be deployed on servers for multi-user access or remote access.**

**Server deployment options:**

- **Docker deployment** - Use Docker containers on any server
- **Manual installation** - Install directly on server with Node.js
- **Cloud platforms** - Deploy to AWS, Google Cloud, Azure, etc.
- **Home server** - Run on Raspberry Pi or home server setup

**Benefits of server deployment:**

- **Remote access** - Access from anywhere with internet
- **Multi-device sync** - Same data across all your devices
- **Better performance** - Dedicated server resources
- **Centralized backup** - Server-based backup solutions

**Considerations:**

- **Security** - Ensure server is properly secured
- **SSL/HTTPS** - Use encrypted connections for remote access
- **Backup** - Implement server backup procedures
- **Maintenance** - Keep server and Tracktor updated

**Deployment guides:**

- **[Docker deployment](/developer-guide/deployment/docker.md)** - Container-based deployment
- **[Manual deployment](/developer-guide/deployment/manual-deployment.md)** - Direct server installation
- **[Production considerations](/developer-guide/deployment/production-considerations.md)** - Security and performance tips

### How do I update Tracktor?

**Update methods depend on how you installed Tracktor.**

**Docker installation updates:**

```bash
# Pull latest image
docker pull tracktor:latest

# Stop current container
docker stop tracktor

# Remove old container
docker rm tracktor

# Start with new image
docker run -p 3000:3000 -v tracktor-data:/app/data -d tracktor:latest

# For Docker Compose
docker-compose pull
docker-compose up -d
```

**Manual installation updates:**

```bash
# Navigate to Tracktor directory
cd tracktor

# Pull latest code
git pull origin main

# Install updated dependencies
npm install

# Rebuild application
npm run build

# Restart application
npm start
```

**Before updating:**

- **Backup your data** - Export all important records
- **Note current version** - Check what version you're running
- **Read release notes** - Understand what's changing
- **Test after update** - Verify everything works correctly

**Update frequency:**

- **Security updates** - Apply immediately when available
- **Feature updates** - Update when you want new features
- **Stable releases** - Recommended for production use
- **Development versions** - Only for testing and development

### What browsers are supported?

**Tracktor supports all modern browsers with specific version requirements.**

**Fully supported browsers:**

- **Google Chrome** - Version 80 and higher (recommended: latest)
- **Mozilla Firefox** - Version 75 and higher (recommended: latest)
- **Apple Safari** - Version 13 and higher (recommended: latest)
- **Microsoft Edge** - Version 80 and higher (recommended: latest)

**Mobile browsers:**

- **Chrome Mobile** - Android and iOS versions
- **Firefox Mobile** - Android and iOS versions
- **Safari Mobile** - iOS version
- **Samsung Internet** - Recent versions on Android

**Not supported:**

- **Internet Explorer** - All versions (discontinued by Microsoft)
- **Very old browsers** - Versions older than specified minimums
- **Text-only browsers** - Lynx, Links, etc.
- **Browsers with JavaScript disabled**

**Browser features required:**

- **JavaScript** - Must be enabled and functional
- **Local Storage** - For data persistence
- **CSS3 support** - For modern interface styling
- **ES6+ support** - For modern JavaScript features

**Recommended browser settings:**

- **JavaScript enabled** - Required for all functionality
- **Cookies allowed** - For session management
- **Local storage allowed** - For data persistence
- **Pop-ups allowed** - For export and some features

## Data and Privacy

### Where is my data stored?

**Your data is stored locally on your device, giving you complete control.**

**Local storage locations:**

- **Browser storage** - In your web browser's local storage system
- **File system** - In Tracktor's data directory (for manual installations)
- **Docker volumes** - In Docker container volumes (for Docker installations)
- **Your device only** - Data never leaves your device unless you export it

**Browser storage details:**

- **Chrome** - `%APPDATA%\Google\Chrome\User Data\Default\Local Storage` (Windows)
- **Firefox** - `~/.mozilla/firefox/[profile]/storage/default` (Linux/Mac)
- **Safari** - `~/Library/Safari/LocalStorage` (Mac)
- **Edge** - Similar to Chrome, in Edge's data directory

**Benefits of local storage:**

- **Privacy** - No external servers have access to your data
- **Speed** - Fast access since data is on your device
- **Offline access** - Works without internet connection
- **Control** - You decide what happens to your data

**Backup responsibility:**

- **Your responsibility** - You must backup your own data
- **Export features** - Use Tracktor's export functionality
- **Multiple copies** - Store backups in multiple locations
- **Regular schedule** - Export data regularly to prevent loss

### Can I sync data between devices?

**Currently, Tracktor doesn't have built-in sync, but there are workarounds.**

**Current limitations:**

- **No cloud sync** - Data stays on each device separately
- **No automatic sync** - Must manually transfer data between devices
- **Device-specific** - Each installation is independent

**Workaround solutions:**

**Export/Import Method:**

1. **Export data** from first device (CSV format)
2. **Transfer file** to second device (email, USB, cloud storage)
3. **Manually enter data** on second device
4. **Keep one device primary** for new entries

**Server Deployment:**

1. **Deploy Tracktor on server** (your own or cloud)
2. **Access from multiple devices** via web browser
3. **Centralized data** - all devices see same data
4. **Requires technical setup** - server management needed

**Browser Sync (Limited):**

- **Some browsers** sync local storage across devices
- **Not reliable** - Not designed for application data
- **Browser-specific** - Only works within same browser ecosystem
- **Not recommended** - May cause data conflicts

**Future plans:**

- **Sync functionality** is being considered for future versions
- **Community interest** - High demand for this feature
- **Technical challenges** - Ensuring data consistency and privacy

### How do I delete all my data?

**You can completely remove all Tracktor data from your device.**

**Browser installations:**

**Chrome:**

1. Settings → Privacy and Security → Site Settings
2. View permissions and data stored across sites
3. Find localhost:3000 (or your Tracktor URL)
4. Click "Clear data" → Delete all data

**Firefox:**

1. Settings → Privacy & Security
2. Cookies and Site Data → Manage Data
3. Search for localhost:3000
4. Select and click "Remove Selected"

**Safari:**

1. Preferences → Privacy
2. Manage Website Data
3. Search for localhost
4. Select and click "Remove"

**Manual installations:**

```bash
# Delete Tracktor directory
rm -rf /path/to/tracktor

# Delete data directory (if separate)
rm -rf /path/to/tracktor-data
```

**Docker installations:**

```bash
# Stop and remove containers
docker stop tracktor
docker rm tracktor

# Remove Docker image
docker rmi tracktor

# Remove data volumes
docker volume rm tracktor-data
```

**Complete removal checklist:**

- [ ] Export important data first (if you want to keep it)
- [ ] Clear browser storage for Tracktor
- [ ] Delete application files
- [ ] Remove Docker containers and volumes
- [ ] Clear browser cache and cookies
- [ ] Remove bookmarks and shortcuts

**Before deletion:**

- **Export data** if you might want it later
- **Consider alternatives** - maybe you just need to reset PIN
- **Understand permanence** - deleted data cannot be recovered
- **Check all devices** - remove from all devices where installed

## Getting Help and Support

### How do I report a bug?

**Bug reports help improve Tracktor for everyone. Here's how to report effectively.**

**Where to report:**

- **GitHub Issues** - [https://github.com/javedh-dev/tracktor/issues](https://github.com/javedh-dev/tracktor/issues)
- **Primary channel** - This is the main place for bug reports
- **Public visibility** - Others can see and contribute to the discussion

**Before reporting:**

1. **Search existing issues** - Your bug might already be reported
2. **Try troubleshooting** - Check the [common issues guide](./common-issues.md)
3. **Reproduce the bug** - Ensure you can make it happen consistently
4. **Gather information** - Collect details about your system and the problem

**What to include in your report:**

- **Clear title** - Descriptive summary of the problem
- **Detailed description** - What happened vs. what you expected
- **Steps to reproduce** - Exact steps to make the bug happen
- **System information** - Browser, OS, Tracktor version
- **Screenshots** - Visual evidence of the problem
- **Console errors** - Any error messages from browser console (F12)

**Example bug report:**

```
Title: Fuel efficiency calculation incorrect after maintenance entry

Description: After adding a maintenance record, the fuel efficiency
calculation for the next fuel log shows an unrealistic 150 MPG instead
of the expected 28 MPG.

Steps to reproduce:
1. Add maintenance record with odometer 45,000
2. Add fuel log with odometer 45,300, 12 gallons
3. View fuel efficiency calculation

Expected: ~25 MPG (300 miles ÷ 12 gallons)
Actual: 150 MPG displayed

System: Chrome 120, Windows 11, Tracktor latest version
Console errors: [screenshot attached]
```

### Where can I request new features?

**Feature requests help shape Tracktor's future development.**

**Where to request:**

- **GitHub Issues** - Use "Feature Request" label
- **GitHub Discussions** - For discussion and community input
- **Community feedback** - Engage with other users about features

**How to request effectively:**

1. **Search existing requests** - Your idea might already be suggested
2. **Describe the need** - Explain why this feature would be helpful
3. **Provide use cases** - Give specific examples of how you'd use it
4. **Consider implementation** - Think about how it might work
5. **Engage with community** - Discuss with other users

**What makes a good feature request:**

- **Clear description** - What exactly do you want?
- **Problem statement** - What problem does this solve?
- **Use cases** - How would you and others use this?
- **Priority** - How important is this feature to you?
- **Alternatives considered** - What workarounds have you tried?

**Feature request process:**

1. **Community discussion** - Features are discussed by users
2. **Developer review** - Maintainers evaluate feasibility
3. **Priority assessment** - Features are prioritized based on need and complexity
4. **Implementation** - Features are developed and released
5. **Community testing** - Users test new features and provide feedback

### How can I contribute to Tracktor?

**Tracktor welcomes contributions from the community in many forms.**

**Ways to contribute:**

**Code Contributions:**

- **Bug fixes** - Fix issues you encounter
- **New features** - Implement requested functionality
- **Performance improvements** - Optimize existing code
- **Documentation** - Improve guides and help content

**Non-Code Contributions:**

- **Bug reports** - Help identify and document issues
- **Feature requests** - Suggest improvements and new functionality
- **Documentation** - Write guides, tutorials, and help content
- **Testing** - Test new features and report issues
- **Community support** - Help other users in discussions

**Getting started with contributions:**

1. **Read contribution guidelines** - Check the project's CONTRIBUTING.md
2. **Start small** - Begin with documentation or small bug fixes
3. **Join discussions** - Participate in GitHub Discussions
4. **Fork the repository** - Create your own copy for development
5. **Submit pull requests** - Propose your changes for review

**Contribution resources:**

- **[Developer Guide](/developer-guide/)** - Technical documentation
- **[GitHub Repository](https://github.com/javedh-dev/tracktor)** - Source code and issues
- **[Contribution Guidelines](https://github.com/javedh-dev/tracktor/blob/main/CONTRIBUTING.md)** - How to contribute

### Is there a user community?

**Yes, Tracktor has an active and helpful community of users and developers.**

**Community platforms:**

- **GitHub Discussions** - [https://github.com/javedh-dev/tracktor/discussions](https://github.com/javedh-dev/tracktor/discussions)
- **GitHub Issues** - Bug reports and feature discussions
- **Documentation** - Community-contributed guides and tutorials

**What the community provides:**

- **User support** - Help with setup, usage, and troubleshooting
- **Feature discussions** - Input on new features and improvements
- **Bug reports** - Identification and documentation of issues
- **Contributions** - Code, documentation, and testing
- **Knowledge sharing** - Tips, tricks, and best practices

**Community guidelines:**

- **Be respectful** - Treat all community members with respect
- **Be helpful** - Share knowledge and assist others
- **Be constructive** - Provide useful feedback and suggestions
- **Search first** - Check existing discussions before posting
- **Stay on topic** - Keep discussions relevant to Tracktor

**How to engage:**

1. **Join GitHub Discussions** - Introduce yourself and ask questions
2. **Help others** - Answer questions you know the answers to
3. **Share experiences** - Tell others about your Tracktor usage
4. **Provide feedback** - Share your thoughts on features and improvements
5. **Contribute** - Help improve Tracktor through code or documentation

**Community benefits:**

- **Faster help** - Community often responds quickly to questions
- **Diverse perspectives** - Different users have different insights
- **Shared knowledge** - Learn from others' experiences
- **Feature influence** - Community input shapes development priorities
- **Networking** - Connect with other vehicle enthusiasts and developers

---

**Still have questions?** Check the [troubleshooting guide](./common-issues.md) or ask the community in [GitHub Discussions](https://github.com/javedh-dev/tracktor/discussions)!

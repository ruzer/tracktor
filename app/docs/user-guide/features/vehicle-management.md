# Vehicle Management

Vehicle management is the foundation of Tracktor - everything starts with adding your vehicles. This comprehensive guide covers adding, editing, and managing vehicle information effectively.

<PlaceholderBlock 
  id="vehicle-management-overview-screenshot"
  type="screenshot" 
  message="Add screenshot of vehicle management interface showing vehicle cards and add button"
  priority="high"
  location="/user-guide/features/vehicle-management.md"
  instructions="Capture the main vehicle management dashboard showing multiple vehicle cards, the add vehicle button, and key interface elements"
/>

## Overview

Vehicle management is the foundation of Tracktor, providing centralized storage for all vehicle information. Every other feature builds upon the vehicle profiles you create here, making accurate vehicle setup essential for optimal tracking.

## Adding a New Vehicle

Adding your first vehicle is quick and straightforward. Each vehicle becomes the foundation for all tracking activities.

### Step-by-Step Process

#### 1. Access Vehicle Management

- **From Dashboard:** Click the "Add Vehicle" button (prominently displayed)
- **From Navigation:** Use the main navigation to access vehicle management
- **Quick Access:** Look for the "+" or "Add" button in the vehicle section

<PlaceholderBlock 
  id="add-vehicle-navigation-screenshot"
  type="screenshot" 
  message="Add screenshot showing different ways to access the add vehicle functionality"
  priority="high"
  location="/user-guide/features/vehicle-management.md"
  instructions="Show the dashboard with add vehicle button highlighted, and navigation menu with vehicle management option"
/>

#### 2. Fill in Vehicle Information

**Required Information:**

- **Make** - Vehicle manufacturer (e.g., Toyota, Honda, Ford, BMW)
- **Model** - Specific model name (e.g., Camry, Civic, F-150, X3)
- **Year** - Manufacturing year (1886 to current year)
- **License Plate** - Vehicle registration number (unique identifier)

<PlaceholderBlock 
  id="vehicle-form-screenshot"
  type="screenshot" 
  message="Add screenshot of the vehicle information form with all fields visible"
  priority="high"
  location="/user-guide/features/vehicle-management.md"
  instructions="Capture the add/edit vehicle form showing all required and optional fields, with example data filled in"
/>

**Optional but Recommended:**

- **VIN (Vehicle Identification Number)** - 17-character unique identifier
- **Color** - Vehicle color (hex color code format)
- **Current Odometer Reading** - Essential for accurate fuel efficiency tracking

#### 3. Vehicle Information Details

**Make and Model Guidelines:**

- **Use standard names** - Toyota (not TOYOTA or toyota)
- **Be specific with models** - Camry LE, Civic Si, F-150 XLT
- **Length limits** - 3-50 characters for both make and model
- **Consistency matters** - Use the same format for similar vehicles

**Year Validation:**

- **Minimum year:** 1886 (when the first car was invented)
- **Maximum year:** Current year
- **Must be integer** - No decimal values allowed

**License Plate Requirements:**

- **Format:** Letters, numbers, spaces, and hyphens allowed
- **Length:** 2-25 characters
- **Must be unique** - Each vehicle needs a different plate number
- **Case sensitive** - ABC123 and abc123 are different

**VIN (Optional but Valuable):**

- **17 characters** standard format
- **Alphanumeric** - excludes I, O, and Q to avoid confusion
- **Unique identifier** - helps with insurance and service records
- **Validation included** - Tracktor checks format and uniqueness

**Color (Optional):**

- **Hex color codes** only (e.g., #FF0000 for red, #0000FF for blue)
- **Helps with identification** - especially useful for multiple similar vehicles
- **Visual representation** - may be used in interface elements

**Odometer Reading (Highly Recommended):**

- **Current mileage** at the time of adding the vehicle
- **Integer values only** - no decimal places
- **Critical for accuracy** - affects fuel efficiency calculations
- **Cannot exceed** future fuel log odometer readings

#### 4. Save Your Vehicle

1. **Review all information** for accuracy
2. **Check required fields** are completed
3. **Click "Save" or "Add Vehicle"** to create the record
4. **Confirmation** - You'll see the vehicle appear in your dashboard

### Example Vehicle Entry

```
Make: Toyota
Model: Camry LE
Year: 2020
License Plate: ABC-1234
VIN: 1HGBH41JXMN109186 (optional)
Color: #C0C0C0 (Silver)
Odometer: 45,230 miles
```

## Editing Vehicle Information

Update vehicle information as needed - whether correcting errors or updating details like odometer readings.

### When to Edit Vehicle Information

- **Correcting entry errors** - Fix typos or incorrect information
- **Updating odometer** - Periodic updates for accuracy
- **Adding missing information** - VIN, color, or other optional details
- **License plate changes** - New registration or state transfers

### Editing Process

#### 1. Locate the Vehicle

- **Dashboard view** - Find the vehicle card
- **Vehicle list** - Browse through your vehicles
- **Search function** - Use search if you have many vehicles

#### 2. Access Edit Mode

- **Click the edit icon** (pencil/pen symbol) next to the vehicle
- **Usually located** in the actions area of the vehicle card
- **Edit button** may be in a dropdown menu for space-saving

#### 3. Modify Information

- **All fields are editable** except the unique ID
- **Pre-populated data** - Current information is already filled in
- **Change only what's needed** - No need to re-enter everything
- **Validation applies** - Same rules as when adding vehicles

#### 4. Save Changes

- **Review modifications** before saving
- **Click "Save Changes"** or "Update Vehicle"
- **Confirmation message** indicates successful update

### Important Editing Considerations

**Odometer Updates:**

- **Cannot be lower** than existing fuel log readings
- **Affects calculations** - Fuel efficiency may be recalculated
- **Update regularly** for accurate tracking

**License Plate Changes:**

- **Must remain unique** - Cannot duplicate existing plates
- **Legal implications** - Ensure changes match official registration
- **Historical records** - Previous logs remain associated with the vehicle

**VIN Changes:**

- **Rarely needed** - VINs don't change for the same vehicle
- **Verification important** - Ensure accuracy for insurance purposes
- **Unique constraint** - Cannot duplicate existing VINs

## Vehicle Details and Data Fields

Understanding each field helps you make the most of Tracktor's vehicle management.

### Core Identification Fields

#### Make (Required)

- **Purpose:** Vehicle manufacturer identification
- **Examples:** Toyota, Honda, Ford, BMW, Mercedes-Benz
- **Validation:** 3-50 characters, letters and spaces
- **Best Practice:** Use official manufacturer names

#### Model (Required)

- **Purpose:** Specific vehicle model identification
- **Examples:** Camry, Civic, F-150, X3, C-Class
- **Validation:** 3-50 characters, letters, numbers, and spaces
- **Best Practice:** Include trim level if known (LE, Si, XLT)

#### Year (Required)

- **Purpose:** Manufacturing year for age and specification tracking
- **Range:** 1886 to current year
- **Validation:** Must be a valid integer year
- **Impact:** Affects maintenance scheduling and value calculations

#### License Plate (Required)

- **Purpose:** Legal identification and unique vehicle identifier
- **Format:** 2-25 characters, letters, numbers, spaces, hyphens
- **Uniqueness:** Must be unique across all vehicles in your account
- **Legal:** Should match official vehicle registration

### Optional Enhancement Fields

#### VIN - Vehicle Identification Number

- **Purpose:** Universal unique identifier for the specific vehicle
- **Format:** 17 alphanumeric characters (excludes I, O, Q)
- **Benefits:**
  - Insurance claim processing
  - Service history tracking
  - Resale value verification
  - Recall notifications
- **Privacy:** Stored securely and used only for your records

#### Color

- **Purpose:** Visual identification, especially for multiple similar vehicles
- **Format:** Hex color codes (#RRGGBB or #RGB)
- **Examples:** #FF0000 (red), #0000FF (blue), #FFFFFF (white)
- **Usage:** May appear in interface elements and reports

#### Odometer Reading

- **Purpose:** Current mileage for accurate fuel efficiency calculations
- **Format:** Integer value (whole numbers only)
- **Importance:** Critical for accurate fuel economy tracking
- **Updates:** Should be updated periodically for accuracy

### System-Generated Fields

#### Vehicle ID

- **Purpose:** Internal unique identifier
- **Format:** UUID (Universally Unique Identifier)
- **Usage:** Links vehicle to fuel logs, maintenance, insurance, and PUCC records
- **Visibility:** Not displayed to users but used internally

#### Timestamps

- **Created Date:** When the vehicle was added to Tracktor
- **Updated Date:** Last modification timestamp
- **Purpose:** Audit trail and data management

## Managing Multiple Vehicles

Tracktor excels at managing multiple vehicles, whether for families, businesses, or vehicle enthusiasts.

### Organization Strategies

#### Naming Conventions

- **Consistent formatting** - Use similar patterns for make/model
- **Descriptive models** - Include trim levels or distinguishing features
- **Logical ordering** - Consider how you want vehicles sorted

#### Visual Identification

- **Use colors** - Assign hex colors that match actual vehicle colors
- **Consistent photos** - If available, use similar angle/style photos
- **Descriptive notes** - Add distinguishing characteristics

### Multi-Vehicle Workflows

#### Dashboard Overview

- **Vehicle cards** show key information for each vehicle
- **Quick actions** available for each vehicle
- **Comparative data** across all vehicles
- **Unified analytics** combining data from all vehicles

#### Feature Integration

- **Fuel tracking** - Compare efficiency across vehicles
- **Maintenance** - Track service schedules for multiple vehicles
- **Insurance** - Manage policies for entire fleet
- **PUCC** - Monitor compliance for all vehicles

## Deleting Vehicles

Remove vehicles from Tracktor when they're no longer needed, such as when selling or disposing of a vehicle.

### Before Deleting: Important Considerations

**Data Impact:**

> **⚠️ Critical Warning:** Deleting a vehicle permanently removes ALL associated data including:
>
> - All fuel logs and efficiency calculations
> - Complete maintenance history and records
> - Insurance policy information and history
> - PUCC certificates and compliance records
> - Any notes, photos, or custom data

**Alternatives to Deletion:**

- **Archive approach** - Stop adding new data but keep historical records
- **Export data** - Save records before deletion for external storage
- **Transfer ownership** - Consider if data should be transferred to new owner

### Safe Deletion Process

#### 1. Data Backup (Recommended)

- **Export fuel logs** - Save efficiency and cost data
- **Export maintenance records** - Preserve service history
- **Save insurance information** - Keep for tax or legal purposes
- **Document PUCC history** - May be needed for compliance records

#### 2. Verify Deletion Intent

- **Confirm correct vehicle** - Double-check you're deleting the right one
- **Review associated data** - Understand what will be lost
- **Consider alternatives** - Is deletion really necessary?

#### 3. Deletion Steps

1. **Locate the vehicle** in your dashboard or vehicle list
2. **Click the delete icon** (trash can symbol)
3. **Read the confirmation dialog** carefully
4. **Type confirmation** if required (vehicle name or "DELETE")
5. **Click "Confirm Deletion"** to permanently remove

#### 4. Post-Deletion

- **Confirmation message** - System confirms successful deletion
- **Dashboard update** - Vehicle no longer appears in lists
- **Data cleanup** - All associated records are removed
- **No recovery** - Deleted data cannot be restored

### Deletion Best Practices

**When to Delete:**

- **Vehicle sold** - No longer owned or managed
- **Vehicle totaled** - Insurance claim completed, no further tracking needed
- **Duplicate entries** - Accidentally created duplicate vehicle records
- **Test data** - Removing test or sample vehicles

**When NOT to Delete:**

- **Temporary non-use** - Vehicle in storage or temporarily not driven
- **Seasonal vehicles** - Motorcycles, RVs, or seasonal-use vehicles
- **Historical value** - Want to maintain records for reference
- **Tax purposes** - May need historical data for deductions or records

## Vehicle Management Best Practices

### Data Entry Best Practices

#### Accuracy First

- **Double-check information** before saving
- **Use official sources** - Registration documents, insurance cards
- **Consistent formatting** - Establish patterns and stick to them
- **Regular updates** - Keep odometer readings current

#### Completeness

- **Fill optional fields** when possible - More data enables better insights
- **Add VIN when available** - Valuable for service and insurance
- **Include color** - Helps with visual identification
- **Update odometer regularly** - Critical for accurate calculations

### Maintenance and Updates

#### Regular Review Schedule

- **Monthly odometer updates** - Keep readings current
- **Quarterly information review** - Check for needed updates
- **Annual data cleanup** - Remove outdated or incorrect information
- **Event-driven updates** - Update after major changes (new plates, etc.)

#### Data Quality

- **Validate entries** - Use Tracktor's built-in validation
- **Cross-reference data** - Ensure consistency across features
- **Monitor calculations** - Check that fuel efficiency seems reasonable
- **Clean up duplicates** - Remove any accidentally created duplicates

### Integration with Other Features

#### Fuel Tracking Integration

- **Accurate odometer** - Essential for efficiency calculations
- **Consistent vehicle selection** - Always log fuel for correct vehicle
- **Regular updates** - Keep vehicle odometer in sync with fuel logs

#### Maintenance Integration

- **Service scheduling** - Use vehicle age and mileage for scheduling
- **Historical tracking** - Maintain complete service records
- **Cost analysis** - Track maintenance costs per vehicle

#### Insurance and PUCC Integration

- **Policy linking** - Ensure insurance policies are linked to correct vehicles
- **Renewal tracking** - Monitor expiry dates for all vehicles
- **Compliance management** - Keep PUCC certificates current

## Troubleshooting Vehicle Management

### Common Issues and Solutions

#### "License Plate Already Exists" Error

**Problem:** Trying to add a vehicle with a license plate that's already in use
**Solutions:**

- Check existing vehicles for duplicates
- Verify the license plate number is correct
- Use a different format if the plate is legitimately different

#### "VIN Already Exists" Error

**Problem:** Attempting to use a VIN that's already associated with another vehicle
**Solutions:**

- Verify the VIN is entered correctly
- Check if the vehicle already exists in your system
- Contact support if you believe this is an error

#### Odometer Validation Errors

**Problem:** Cannot update odometer reading due to validation errors
**Solutions:**

- Ensure new reading is higher than previous readings
- Check fuel logs for conflicting odometer readings
- Update fuel logs first if necessary

#### Cannot Delete Vehicle

**Problem:** Delete option is not available or fails
**Solutions:**

- Check if vehicle has associated data that needs to be handled first
- Ensure you have proper permissions
- Try refreshing the page and attempting again

### Getting Help

If you encounter issues with vehicle management:

1. **Check validation messages** - Read error messages carefully
2. **Review this documentation** - Ensure you're following correct procedures
3. **Try different browsers** - Some issues may be browser-specific
4. **Contact support** - Use the help system for technical issues

Vehicle management is the foundation of effective vehicle tracking in Tracktor. Take time to set up your vehicles properly, and you'll benefit from accurate tracking and insights across all other features.

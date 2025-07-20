import sequelize from './config/database.js';
import User from './models/User.js';
import Vehicle from './models/Vehicle.js';
import FuelLog from './models/FuelLog.js';
import bcrypt from 'bcrypt';

const seedDatabase = async () => {
  try {
    // This will drop the table if it already exists
    await sequelize.sync({ force: true });
    console.log('Database synchronized!');

    // Create a user with a PIN
    const pin = '123456';
    const hash = await bcrypt.hash(pin, 10);
    await User.create({ id: 1, hash });
    console.log(`User created with PIN: ${pin}`);

    // Create vehicles
    const vehicle1 = await Vehicle.create({
      make: 'Honda',
      model: 'Civic',
      year: 2022,
      licensePlate: 'TS-07-JA-1997',
      vin: '123456789',
      color: 'Black',
      odometer: 15000,
    });

    const vehicle2 = await Vehicle.create({
      make: 'Toyota',
      model: 'Corolla',
      year: 2021,
      licensePlate: 'AP-28-DX-2000',
      vin: '987654321',
      color: 'White',
      odometer: 25000,
    });
    
    console.log('Vehicles created.');

    const vehicle1FuelLogs: any = [
        {
            vehicleId: vehicle1.id,
            date: '2024-01-15',
            odometer: 15500,
            fuelAmount: 35,
            cost: 50,
            notes: 'Full tank',
        },
        {
            vehicleId: vehicle1.id,
            date: '2024-02-15',
            odometer: 16000,
            fuelAmount: 32,
            cost: 48,
        },
        {
            vehicleId: vehicle1.id,
            date: '2024-03-15',
            odometer: 16500,
            fuelAmount: 33,
            cost: 52,
        },
        {
            vehicleId: vehicle1.id,
            date: '2024-04-15',
            odometer: 17000,
            fuelAmount: 34,
            cost: 55,
        }
    ];
    let currentDate1 = new Date('2024-04-15');
    let currentOdometer1 = 17000;
    for (let i = 0; i < 50; i++) {
      currentDate1.setDate(currentDate1.getDate() + 7);
      currentOdometer1 += Math.floor(Math.random() * 301) + 200;
      const fuelAmount = Math.random() * 11 + 30;
      const cost = Math.random() * 16 + 50;
      vehicle1FuelLogs.push({
        vehicleId: vehicle1.id,
        date: currentDate1.toISOString().split('T')[0],
        odometer: currentOdometer1,
        fuelAmount: parseFloat(fuelAmount.toFixed(2)),
        cost: parseFloat(cost.toFixed(2)),
      });
    }

    const vehicle2FuelLogs: any = [
        {
            vehicleId: vehicle2.id,
            date: '2024-01-20',
            odometer: 25600,
            fuelAmount: 40,
            cost: 60,
        },
        {
            vehicleId: vehicle2.id,
            date: '2024-02-20',
            odometer: 26200,
            fuelAmount: 38,
            cost: 55,
            notes: 'Filled at Shell',
        },
        {
            vehicleId: vehicle2.id,
            date: '2024-03-20',
            odometer: 26800,
            fuelAmount: 39,
            cost: 58,
        },
        {
            vehicleId: vehicle2.id,
            date: '2024-04-20',
            odometer: 27400,
            fuelAmount: 41,
            cost: 62,
        }
    ];
    let currentDate2 = new Date('2024-04-20');
    let currentOdometer2 = 27400;
    for (let i = 0; i < 50; i++) {
      currentDate2.setDate(currentDate2.getDate() + 7);
      currentOdometer2 += Math.floor(Math.random() * 301) + 200;
      const fuelAmount = Math.random() * 11 + 30;
      const cost = Math.random() * 16 + 50;
      vehicle2FuelLogs.push({
        vehicleId: vehicle2.id,
        date: currentDate2.toISOString().split('T')[0],
        odometer: currentOdometer2,
        fuelAmount: parseFloat(fuelAmount.toFixed(2)),
        cost: parseFloat(cost.toFixed(2)),
      });
    }

    // Create fuel logs for vehicle 1
    await FuelLog.bulkCreate(vehicle1FuelLogs);

    // Create fuel logs for vehicle 2
    await FuelLog.bulkCreate(vehicle2FuelLogs);
    
    console.log('Fuel logs created.');
    console.log('Dummy data populated successfully!');
  } catch (error) {
    console.error('Error populating database:', error);
  } finally {
    await sequelize.close();
  }
};

seedDatabase();
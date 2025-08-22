import { DataTypes } from "sequelize";
import type { Migration } from "../index.js";

export const up: Migration = async ({ context: queryInterface }) => {
  const transaction = await queryInterface.sequelize.transaction();

  try {
    await queryInterface.createTable(
      "Auths",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        hash: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      },
      { transaction }
    );

    await queryInterface.createTable(
      "Configs",
      {
        key: {
          type: DataTypes.STRING,
          primaryKey: true,
        },
        value: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        description: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      },
      { transaction }
    );

    await queryInterface.createTable(
      "Vehicles",
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4,
        },
        make: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        model: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        year: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        licensePlate: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        vin: {
          type: DataTypes.STRING,
          allowNull: true,
          unique: true,
        },
        color: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        odometer: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      },
      { transaction }
    );

    await queryInterface.createTable(
      "Insurances",
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4,
        },
        vehicleId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: "Vehicles",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        provider: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        policyNumber: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        startDate: {
          type: DataTypes.DATEONLY,
          allowNull: false,
        },
        endDate: {
          type: DataTypes.DATEONLY,
          allowNull: false,
        },
        cost: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        notes: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      },
      { transaction }
    );

    await queryInterface.createTable(
      "MaintenanceLogs",
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4,
        },
        vehicleId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: "Vehicles",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        date: {
          type: DataTypes.DATEONLY,
          allowNull: false,
        },
        odometer: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        serviceCenter: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        cost: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        notes: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      },
      { transaction }
    );

    await queryInterface.createTable(
      "FuelLogs",
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4,
        },
        vehicleId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: "Vehicles",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        date: {
          type: DataTypes.DATEONLY,
          allowNull: false,
        },
        odometer: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        fuelAmount: {
          type: DataTypes.DECIMAL(8, 2),
          allowNull: false,
        },
        cost: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        notes: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      },
      { transaction }
    );

    await queryInterface.createTable(
      "PollutionCertificates",
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4,
        },
        vehicleId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: "Vehicles",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        certificateNumber: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        issueDate: {
          type: DataTypes.DATEONLY,
          allowNull: false,
        },
        expiryDate: {
          type: DataTypes.DATEONLY,
          allowNull: false,
        },
        testingCenter: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        notes: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      },
      { transaction }
    );

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const down: Migration = async ({ context: queryInterface }) => {
  const transaction = await queryInterface.sequelize.transaction();

  try {
    await queryInterface.dropTable("PollutionCertificates", { transaction });
    await queryInterface.dropTable("FuelLogs", { transaction });
    await queryInterface.dropTable("MaintenanceLogs", { transaction });
    await queryInterface.dropTable("Insurances", { transaction });
    await queryInterface.dropTable("Vehicles", { transaction });
    await queryInterface.dropTable("Configs", { transaction });
    await queryInterface.dropTable("Auths", { transaction });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

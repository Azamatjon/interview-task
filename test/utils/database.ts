import { DataSource } from 'typeorm';
import { User } from '../../src/entities/user.entity';
import { Group } from '../../src/entities/group.entity';
import { Item } from '../../src/entities/item.entity';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

let dataSource: DataSource | null = null;

export const setupDatabase = async () => {
  if (!dataSource) {
    dataSource = new DataSource({
      type: 'postgres',
      host: process.env.TYPEORM_HOST || 'localhost',
      port: parseInt(process.env.TYPEORM_PORT || '5432', 10),
      username: process.env.TYPEORM_USERNAME || 'test_user',
      password: process.env.TYPEORM_PASSWORD || 'test_password',
      database: process.env.TYPEORM_DATABASE || 'test_db',
      entities: [User, Group, Item],
      synchronize: true,
      logging: false,
    });
    await dataSource.initialize();
  }
};

export const clearDatabase = async () => {
  if (!dataSource) return;

  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();

  try {
    console.log('Starting database cleanup');

    // Disable foreign key constraints
    await queryRunner.query('SET session_replication_role = replica;');

    // Get all table names and truncate them using CASCADE
    const tableNames = dataSource.entityMetadatas.map(
      (entity) => `"${entity.tableName}"`,
    );
    const tables = tableNames.join(', ');

    if (tableNames.length > 0) {
      await queryRunner.query(`TRUNCATE TABLE ${tables} CASCADE;`);
    }

    console.log('Database cleanup completed');
  } catch (error) {
    console.error('Error during database cleanup:', error);
  } finally {
    // Re-enable foreign key constraints
    await queryRunner.query('SET session_replication_role = DEFAULT;');
    await queryRunner.release();
  }
};

export const closeDatabase = async () => {
  if (dataSource) {
    await dataSource.destroy();
    dataSource = null;
  }
};

import { DataSource } from "typeorm"

export const runMigrations = async (dataSource: DataSource) => {
    await dataSource.runMigrations()
}

export const cleanDB = async (dataSource: DataSource) => {
    const entities = dataSource.entityMetadatas
        for (const entity of entities) {
            const repository = dataSource.getRepository(entity.name);

            await repository.query(
                `TRUNCATE TABLE "${entity.tableName}" RESTART IDENTITY CASCADE;`
            );
        }
}
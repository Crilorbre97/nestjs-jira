import { DataSource } from "typeorm"

export const cleanDB = async (dataSource: DataSource) => {
    const entities = dataSource.entityMetadatas
        for (const entity of entities) {
            const repository = dataSource.getRepository(entity.name);

            await repository.query(
                `TRUNCATE TABLE "${entity.tableName}" RESTART IDENTITY CASCADE;`
            );
        }
}
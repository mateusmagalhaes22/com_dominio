import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddPhoneToCondominium1727365200000 implements MigrationInterface {
  name = 'AddPhoneToCondominium1727365200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'condominium',
      new TableColumn({
        name: 'phone',
        type: 'varchar',
        length: '255',
        isNullable: true,
        comment: 'Telefone da portaria do condomínio (opcional)',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('condominium', 'phone');
  }
}
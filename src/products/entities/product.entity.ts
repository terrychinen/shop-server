import { ProductImage } from './product-image.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Product {
  @ApiProperty({
    example: '24f7a03f-7856-4555-891f-5a1de15f795d',
    description: 'Product ID',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: `Pokemon's T-shit3`,
    description: 'Product name',
    uniqueItems: true,
  })
  @Column({
    unique: true,
  })
  title: string;

  @ApiProperty({ example: 30.5, description: 'Product price' })
  @Column('float', {
    default: 0,
  })
  price: number;

  @ApiProperty({
    example: `This is a pokemon's t-shirt`,
    description: 'Product description',
    default: null,
  })
  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @ApiProperty()
  @Column('text', {
    unique: true,
  })
  slug: string;

  @ApiProperty()
  @Column('int', {
    default: 0,
  })
  stock: number;

  @ApiProperty()
  @Column('text', {
    array: true,
  })
  sizes: string[];

  @ApiProperty()
  @Column('text')
  gender: string;

  @ApiProperty()
  @Column('text', {
    array: true,
    default: [],
  })
  tags: string[];

  @ApiProperty()
  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true,
  })
  images?: ProductImage[];

  @ManyToOne(() => User, (user) => user.product, { eager: true })
  user: User;

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }

    this.slug = this.title
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll(`'`, '');
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    this.slug = this.title
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll(`'`, '');
  }
}

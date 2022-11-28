import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/product-data';
import { User } from '../auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {
  constructor(
    private readonly _productsService: ProductsService,
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
  ) {}

  async executeSeed() {
    await this._truncateTables();
    const user = await this._insertUsers();
    return await this._insertProducts(user);
  }

  private async _truncateTables() {
    await this._productsService.deleteAllProducts();
    const queryBuilder = this._userRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }

  private async _insertUsers() {
    const seedUsers = initialData.users;
    const users: User[] = [];
    seedUsers.forEach((user) => {
      users.push(this._userRepository.create(user));
    });

    await this._userRepository.save(users);
    return users[0];
  }

  private async _insertProducts(user: User) {
    await this._productsService.deleteAllProducts();
    const products = initialData.products;
    const insertPromises = [];

    products.map((product) => {
      insertPromises.push(this._productsService.create(product, user));
    });

    await Promise.all(insertPromises);
    return true;
  }
}

import { getConnection } from '../data-source';
import { Quote } from '../entities/Quote';

export class QuoteRepository {
    async create(quoteData: Partial<Quote>) {
        const quoteRepo = getConnection().getRepository(Quote);
        return await quoteRepo.save(quoteData);
    }

    async findById(id: string) {
        const quoteRepo = getConnection().getRepository(Quote);
        return await quoteRepo.findOne({ where: { id } });
    }

    async findAll() {
        const quoteRepo = getConnection().getRepository(Quote);
        return await quoteRepo.find({ order: { createdAt: 'DESC' } });
    }
}

export const quoteRepository = new QuoteRepository();

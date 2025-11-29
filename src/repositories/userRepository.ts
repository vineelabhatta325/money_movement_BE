import { getConnection } from '../data-source';
import { User } from '../entities/User';

export const userRepository = {
    findByUsername: async (username: string) => {
        const repository = getConnection().getRepository(User);
        return await repository.findOne({ where: { username } });
    }
};

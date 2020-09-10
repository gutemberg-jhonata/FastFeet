import Sequelize, { Model } from 'sequelize';

class File extends Model {
  async init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
  }
}

export default File;

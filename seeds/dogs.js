const { breedData, groupData} = require('../dog-data.js')

const createGroup = (knex, group) => {
  return knex('breed_groups').insert({
    group_name: group.name,
    description: group.description,
    breed_count: group.breedCount
  }, 'id')
    .then(groupId => {
      let breedPromises = [];

      breedData.forEach(breed => {
        if (breed.group_id === group.id) {
            breedPromises.push(
              createBreed(knex, {
                breed_name: breed.name,
                life_span: breed.life_span,
                bred_for: breed.bred_for,
                temperament: breed.temperament,
                weight: breed.weight,
                height: breed.height,
                lovable: true,
                group_id: groupId[0]
              })
            )
        }
      });
      return Promise.all(breedPromises);
    })
};

const createBreed = (knex, breed) => {
  return knex('dog_breeds').insert(breed);
};


exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('dog_breeds').del()
    .then(() => knex('breed_groups').del())
    .then(() => {
      // Inserts seed entries
      let groupPromises = [];

      groupData.forEach(group => {
        groupPromises.push(createGroup(knex, group));
      });
      console.log('Hell yeah, things are happening. The seed has been spilled. ')
      return Promise.all(groupPromises);
    })
    .catch(error => console.log(`Error seeding data: ${error}`))
};
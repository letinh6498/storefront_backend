import { MythicalWeaponStore } from '../mythical_weapon';

const store = new MythicalWeaponStore();

fdescribe('WeaponStore', () => {
  it('should have index method', async () => {
    expect(await store.index).toBeDefined();
  });

  it('should index have return list of products', async () => {
    const result = await store.index();
    expect(result).toEqual([
      {
        id: 100,
        name: 'đao',
        type: 'knife',
        weight: 100,
      },
    ]);
  });
});

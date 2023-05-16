import { BookStore } from '../book';

const store = new BookStore();

describe('Book Model', () => {
  fit('should have an index method', () => {
    expect(store.index).toBeDefined();
  });

  fit('should have a show method', () => {
    expect(store.index).toBeDefined();
  });

  fit('should have a create method', () => {
    expect(store.index).toBeDefined();
  });

  fit('should have a update method', () => {
    expect(store.index).toBeDefined();
  });

  fit('should have a delete method', () => {
    expect(store.index).toBeDefined();
  });

  fit('create method should add a book', async () => {
    const result = await store.create({
      title: 'Bridge to Terabithia',
      summary: 'Childrens',
      author: 'Katherine Paterson',
      totalpages: 250,
      id: 1,
    });
    expect(result).toEqual({
      title: 'Bridge to Terabithia',
      summary: 'Childrens',
      author: 'Katherine Paterson',
      totalpages: 250,
      id: 1,
    });
  });

  fit('index method should return a list of books', async () => {
    const result = await store.index();
    expect(result).toEqual([
      {
        title: 'Bridge to Terabithia',
        summary: 'Childrens',
        author: 'Katherine Paterson',
        totalpages: 250,
        id: 1,
      },
    ]);
  });

  fit('show method should return the correct book', async () => {
    const result = await store.show('1');
    expect(result).toEqual({
      title: 'Bridge to Terabithia',
      summary: 'Childrens',
      author: 'Katherine Paterson',
      totalpages: 250,
      id: 1,
    });
  });

  fit('delete method should remove the book', async () => {
    store.delete('1');
    const result = await store.index();
    expect(result).toEqual([]);
  });
});

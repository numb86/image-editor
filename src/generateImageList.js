import specifyShowState from './specifyShowState';

export default function generateImageList(type, data, currentState) {
  switch (type) {
    case 'specifyShowState':
      return specifyShowState(data, currentState);
    default:
      throw new Error('This type is not found.');
  }
}

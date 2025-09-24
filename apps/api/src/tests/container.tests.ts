import { container } from '../container';

describe('Container', () => {
  it('should resolve userRepository', () => {
    const userRepository = container.resolve('userRepository');
    expect(userRepository).toBeDefined();
    expect(typeof userRepository.getUser).toBe('function');
    expect(typeof userRepository.updateDailyGoal).toBe('function');
  });

  it('should resolve contactRepository', () => {
    const contactRepository = container.resolve('contactRepository');
    expect(contactRepository).toBeDefined();
    expect(typeof contactRepository.listContacts).toBe('function');
    expect(typeof contactRepository.createContact).toBe('function');
    expect(typeof contactRepository.getContact).toBe('function');
    expect(typeof contactRepository.patchContact).toBe('function');
  });

  it('should resolve planRepository', () => {
    const planRepository = container.resolve('planRepository');
    expect(planRepository).toBeDefined();
    expect(typeof planRepository.getDailyPlan).toBe('function');
  });

  it('should resolve touchesRepository', () => {
    const touchesRepository = container.resolve('touchesRepository');
    expect(touchesRepository).toBeDefined();
    expect(typeof touchesRepository.createTouch).toBe('function');
  });

  it('should resolve userController', () => {
    const userController = container.resolve('userController');
    expect(userController).toBeDefined();
    expect(typeof userController.getMe).toBe('function');
    expect(typeof userController.updateDailyGoal).toBe('function');
  });

  it('should resolve contactsController', () => {
    const contactsController = container.resolve('contactsController');
    expect(contactsController).toBeDefined();
    expect(typeof contactsController.getContacts).toBe('function');
    expect(typeof contactsController.createContact).toBe('function');
    expect(typeof contactsController.patchContact).toBe('function');
  });

  it('should resolve planController', () => {
    const planController = container.resolve('planController');
    expect(planController).toBeDefined();
    expect(typeof planController.getDailyPlan).toBe('function');
  });

  it('should resolve touchesController', () => {
    const touchesController = container.resolve('touchesController');
    expect(touchesController).toBeDefined();
    expect(typeof touchesController.createTouch).toBe('function');
  });

  it('should resolve routes', () => {
    const routes = container.resolve('routes');
    expect(routes).toBeDefined();
    expect(typeof routes.mountRoutes).toBe('function');
  });

  it('should resolve connection', () => {
    const connection = container.resolve('connection');
    expect(connection).toBeDefined();
  });

  it('should resolve ContactMethod enum from contracts', () => {
    const ContactMethod = container.resolve('ContactMethod'); // Type-safe through container!
    expect(ContactMethod).toBeDefined();
    expect(typeof ContactMethod.email).toBe('object');
    expect(typeof ContactMethod.sms).toBe('object');
    expect(typeof ContactMethod.call).toBe('object');
    expect(typeof ContactMethod.other).toBe('object');
  });
});

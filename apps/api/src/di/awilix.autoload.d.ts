/* AUTO-GENERATED. DO NOT EDIT.
Re-run `npm run gen:container` after adding/removing services.
*/
type KoaServer = import('../koaServer').KoaServer;

type AuthService = import('../services/authService').AuthService;

type ImportService = import('../services/importService').ImportService;

type ContactRepository = import('../repositories/contactRepository').ContactRepository;

type PlanRepository = import('../repositories/planRepository').PlanRepository;

type TouchesRepository = import('../repositories/touchesRepository').TouchesRepository;

type UserRepository = import('../repositories/userRepository').UserRepository;

type AuthController = import('../controllers/authController').AuthController;

type ContactsController = import('../controllers/contactsController').ContactsController;

type PlanController = import('../controllers/planController').PlanController;

type TouchesController = import('../controllers/touchesController').TouchesController;

type UserController = import('../controllers/userController').UserController;

type AuthMiddleware = import('../middleware/authMiddleware').AuthMiddleware;

type OptionalAuthMiddleware = import('../middleware/authMiddleware').OptionalAuthMiddleware;

type AuthRoutes = import('../routes/authRoutes').AuthRoutes;

type ContactRoutes = import('../routes/contactRoutes').ContactRoutes;

type Routes = import('../routes/createRoutes').Routes;

type PlanRoutes = import('../routes/planRoutes').PlanRoutes;

type TouchesRoutes = import('../routes/touchesRoutes').TouchesRoutes;

type UserRoutes = import('../routes/userRoutes').UserRoutes;

export interface AutoLoadedContainer {
  koaServer: KoaServer;
  authService: AuthService;
  importService: ImportService;
  contactRepository: ContactRepository;
  planRepository: PlanRepository;
  touchesRepository: TouchesRepository;
  userRepository: UserRepository;
  authController: AuthController;
  contactsController: ContactsController;
  planController: PlanController;
  touchesController: TouchesController;
  userController: UserController;
  authMiddleware: AuthMiddleware;
  optionalAuthMiddleware: OptionalAuthMiddleware;
  authRoutes: AuthRoutes;
  contactRoutes: ContactRoutes;
  routes: Routes;
  planRoutes: PlanRoutes;
  touchesRoutes: TouchesRoutes;
  userRoutes: UserRoutes;
}

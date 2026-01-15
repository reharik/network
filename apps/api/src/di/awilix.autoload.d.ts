/* AUTO-GENERATED. DO NOT EDIT.
Re-run `npm run gen:container` after adding/removing services.
*/
type KoaServer = import('../koaServer').KoaServer;

type AuthService = import('../services/authService').AuthService;

type EmailService = import('../services/emailService').EmailService;

type ImportService = import('../services/importService').ImportService;

type MockVoiceService = import('../services/mockVoiceService').MockVoiceService;

type PlanService = import('../services/planService').PlanService;

type SmsService = import('../services/smsService').SmsService;

type VoiceService = import('../services/voiceService').VoiceService;

type ContactRepository = import('../repositories/contactRepository').ContactRepository;

type PlanRepository = import('../repositories/planRepository').PlanRepository;

type TouchesRepository = import('../repositories/touchesRepository').TouchesRepository;

type UserRepository = import('../repositories/userRepository').UserRepository;

type AuthController = import('../controllers/authController').AuthController;

type CommunicationController =
  import('../controllers/communicationController').CommunicationController;

type ContactsController = import('../controllers/contactsController').ContactsController;

type PlanController = import('../controllers/planController').PlanController;

type TouchesController = import('../controllers/touchesController').TouchesController;

type UserController = import('../controllers/userController').UserController;

type AuthMiddleware = import('../middleware/authMiddleware').AuthMiddleware;

type OptionalAuthMiddleware = import('../middleware/authMiddleware').OptionalAuthMiddleware;

type AuthRoutes = import('../routes/authRoutes').AuthRoutes;

type CommunicationRoutes = import('../routes/communicationRoutes').CommunicationRoutes;

type ContactRoutes = import('../routes/contactRoutes').ContactRoutes;

type Routes = import('../routes/createRoutes').Routes;

type PlanRoutes = import('../routes/planRoutes').PlanRoutes;

type TouchesRoutes = import('../routes/touchesRoutes').TouchesRoutes;

type UserRoutes = import('../routes/userRoutes').UserRoutes;

export interface AutoLoadedContainer {
  koaServer: KoaServer;
  authService: AuthService;
  emailService: EmailService;
  importService: ImportService;
  mockVoiceService: MockVoiceService;
  planService: PlanService;
  smsService: SmsService;
  voiceService: VoiceService;
  contactRepository: ContactRepository;
  planRepository: PlanRepository;
  touchesRepository: TouchesRepository;
  userRepository: UserRepository;
  authController: AuthController;
  communicationController: CommunicationController;
  contactsController: ContactsController;
  planController: PlanController;
  touchesController: TouchesController;
  userController: UserController;
  authMiddleware: AuthMiddleware;
  optionalAuthMiddleware: OptionalAuthMiddleware;
  authRoutes: AuthRoutes;
  communicationRoutes: CommunicationRoutes;
  contactRoutes: ContactRoutes;
  routes: Routes;
  planRoutes: PlanRoutes;
  touchesRoutes: TouchesRoutes;
  userRoutes: UserRoutes;
}

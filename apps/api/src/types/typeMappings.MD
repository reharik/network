client => serialized enums => api middleware
api middleware => revived enums => controller
controller => validateDto (full enums, all required fields for new, no required fields for patch) => service
service => validatedDto => repository
repository => preparedDto (enums->strings) => DB
DB => preparedDto (enums->strings) => repository
repository =>

WRITE -> Create, Patch, Delete
clientApi => serialized enums => api middleware
api middleware => revived enums => controller
service
a) create => validatedEntity => repository
b) patch
i) retrieve entity => repository
ii) mergePatch to entity => service
ii) validate entity => repository
c) delete
i) retrieve entity => repository
ii) validate delete entity => service
iii) delete entity => repository
repository => prepareForDB => DB
DB => reviveEnums => repository
repository => entity => service
service => business logic rinse repeat => service
service => entity/errors => controller
controller => entity => api middleware
api middleware => serialized enums => clientApi
clientApi => revive enums => clientDisplay

CLIENT
fully partial with valid data for create & patch
fully required and valid data for create

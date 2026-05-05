export interface City {
  id: string;
  city: string;
  country: string;
  airportCode: string;
  label: string;
  searchKeywords: string[];
}

export const LATAM_CITIES: City[] = [
  // México
  { id: "MX-MEX", city: "Ciudad de México", country: "México", airportCode: "MEX", label: "Ciudad de México (MEX) - México", searchKeywords: ["ciudad de mexico", "cdmx", "mexico", "mex"] },
  { id: "MX-GDL", city: "Guadalajara", country: "México", airportCode: "GDL", label: "Guadalajara (GDL) - México", searchKeywords: ["guadalajara", "mexico", "gdl"] },
  { id: "MX-MTY", city: "Monterrey", country: "México", airportCode: "MTY", label: "Monterrey (MTY) - México", searchKeywords: ["monterrey", "mexico", "mty"] },
  { id: "MX-PBL", city: "Puebla", country: "México", airportCode: "PBC", label: "Puebla (PBC) - México", searchKeywords: ["puebla", "mexico", "pbc"] },
  { id: "MX-TIJ", city: "Tijuana", country: "México", airportCode: "TIJ", label: "Tijuana (TIJ) - México", searchKeywords: ["tijuana", "mexico", "tij"] },
  { id: "MX-MID", city: "Mérida", country: "México", airportCode: "MID", label: "Mérida (MID) - México", searchKeywords: ["merida", "mérida", "mexico", "mid"] },
  { id: "MX-CUN", city: "Cancún", country: "México", airportCode: "CUN", label: "Cancún (CUN) - México", searchKeywords: ["cancun", "cancún", "mexico", "cun"] },
  
  // Colombia
  { id: "CO-BOG", city: "Bogotá", country: "Colombia", airportCode: "BOG", label: "Bogotá (BOG) - Colombia", searchKeywords: ["bogota", "bogotá", "colombia", "bog"] },
  { id: "CO-MDE", city: "Medellín", country: "Colombia", airportCode: "MDE", label: "Medellín (MDE) - Colombia", searchKeywords: ["medellin", "medellín", "colombia", "mde"] },
  { id: "CO-CLO", city: "Cali", country: "Colombia", airportCode: "CLO", label: "Cali (CLO) - Colombia", searchKeywords: ["cali", "colombia", "clo"] },
  { id: "CO-BAQ", city: "Barranquilla", country: "Colombia", airportCode: "BAQ", label: "Barranquilla (BAQ) - Colombia", searchKeywords: ["barranquilla", "colombia", "baq"] },
  { id: "CO-CTG", city: "Cartagena", country: "Colombia", airportCode: "CTG", label: "Cartagena (CTG) - Colombia", searchKeywords: ["cartagena", "colombia", "ctg"] },
  { id: "CO-BGA", city: "Bucaramanga", country: "Colombia", airportCode: "BGA", label: "Bucaramanga (BGA) - Colombia", searchKeywords: ["bucaramanga", "colombia", "bga"] },
  { id: "CO-ADZ", city: "San Andrés", country: "Colombia", airportCode: "ADZ", label: "San Andrés (ADZ) - Colombia", searchKeywords: ["san andres", "san andrés", "colombia", "adz"] },

  // Argentina
  { id: "AR-BUE", city: "Buenos Aires", country: "Argentina", airportCode: "EZE", label: "Buenos Aires (EZE) - Argentina", searchKeywords: ["buenos aires", "bue", "eze", "argentina"] },
  { id: "AR-COR", city: "Córdoba", country: "Argentina", airportCode: "COR", label: "Córdoba (COR) - Argentina", searchKeywords: ["cordoba", "córdoba", "argentina", "cor"] },
  { id: "AR-ROS", city: "Rosario", country: "Argentina", airportCode: "ROS", label: "Rosario (ROS) - Argentina", searchKeywords: ["rosario", "argentina", "ros"] },
  { id: "AR-MDZ", city: "Mendoza", country: "Argentina", airportCode: "MDZ", label: "Mendoza (MDZ) - Argentina", searchKeywords: ["mendoza", "argentina", "mdz"] },
  { id: "AR-LPG", city: "La Plata", country: "Argentina", airportCode: "LPG", label: "La Plata (LPG) - Argentina", searchKeywords: ["la plata", "argentina", "lpg"] },

  // Brasil
  { id: "BR-SAO", city: "São Paulo", country: "Brasil", airportCode: "GRU", label: "São Paulo (GRU) - Brasil", searchKeywords: ["sao paulo", "são paulo", "brasil", "gru"] },
  { id: "BR-RIO", city: "Río de Janeiro", country: "Brasil", airportCode: "GIG", label: "Río de Janeiro (GIG) - Brasil", searchKeywords: ["rio de janeiro", "río de janeiro", "brasil", "gig"] },
  { id: "BR-BSB", city: "Brasilia", country: "Brasil", airportCode: "BSB", label: "Brasilia (BSB) - Brasil", searchKeywords: ["brasilia", "brasil", "bsb"] },
  { id: "BR-SSA", city: "Salvador", country: "Brasil", airportCode: "SSA", label: "Salvador (SSA) - Brasil", searchKeywords: ["salvador", "brasil", "ssa"] },
  { id: "BR-CNF", city: "Belo Horizonte", country: "Brasil", airportCode: "CNF", label: "Belo Horizonte (CNF) - Brasil", searchKeywords: ["belo horizonte", "brasil", "cnf"] },
  { id: "BR-CWB", city: "Curitiba", country: "Brasil", airportCode: "CWB", label: "Curitiba (CWB) - Brasil", searchKeywords: ["curitiba", "brasil", "cwb"] },
  { id: "BR-POA", city: "Porto Alegre", country: "Brasil", airportCode: "POA", label: "Porto Alegre (POA) - Brasil", searchKeywords: ["porto alegre", "brasil", "poa"] },
  { id: "BR-REC", city: "Recife", country: "Brasil", airportCode: "REC", label: "Recife (REC) - Brasil", searchKeywords: ["recife", "brasil", "rec"] },
  { id: "BR-FOR", city: "Fortaleza", country: "Brasil", airportCode: "FOR", label: "Fortaleza (FOR) - Brasil", searchKeywords: ["fortaleza", "brasil", "for"] },

  // Chile
  { id: "CL-SCL", city: "Santiago", country: "Chile", airportCode: "SCL", label: "Santiago (SCL) - Chile", searchKeywords: ["santiago", "chile", "scl"] },
  { id: "CL-VAP", city: "Valparaíso", country: "Chile", airportCode: "VAP", label: "Valparaíso (VAP) - Chile", searchKeywords: ["valparaiso", "valparaíso", "chile", "vap"] },
  { id: "CL-KNA", city: "Viña del Mar", country: "Chile", airportCode: "KNA", label: "Viña del Mar (KNA) - Chile", searchKeywords: ["vina del mar", "viña del mar", "chile", "kna"] },
  { id: "CL-CCP", city: "Concepción", country: "Chile", airportCode: "CCP", label: "Concepción (CCP) - Chile", searchKeywords: ["concepcion", "concepción", "chile", "ccp"] },
  { id: "CL-ANF", city: "Antofagasta", country: "Chile", airportCode: "ANF", label: "Antofagasta (ANF) - Chile", searchKeywords: ["antofagasta", "chile", "anf"] },

  // Perú
  { id: "PE-LIM", city: "Lima", country: "Perú", airportCode: "LIM", label: "Lima (LIM) - Perú", searchKeywords: ["lima", "peru", "perú", "lim"] },
  { id: "PE-AQP", city: "Arequipa", country: "Perú", airportCode: "AQP", label: "Arequipa (AQP) - Perú", searchKeywords: ["arequipa", "peru", "perú", "aqp"] },
  { id: "PE-CUZ", city: "Cusco", country: "Perú", airportCode: "CUZ", label: "Cusco (CUZ) - Perú", searchKeywords: ["cusco", "cuzco", "peru", "perú", "cuz"] },
  { id: "PE-TRU", city: "Trujillo", country: "Perú", airportCode: "TRU", label: "Trujillo (TRU) - Perú", searchKeywords: ["trujillo", "peru", "perú", "tru"] },
  { id: "PE-PIU", city: "Piura", country: "Perú", airportCode: "PIU", label: "Piura (PIU) - Perú", searchKeywords: ["piura", "peru", "perú", "piu"] },

  // Ecuador
  { id: "EC-UIO", city: "Quito", country: "Ecuador", airportCode: "UIO", label: "Quito (UIO) - Ecuador", searchKeywords: ["quito", "ecuador", "uio"] },
  { id: "EC-GYE", city: "Guayaquil", country: "Ecuador", airportCode: "GYE", label: "Guayaquil (GYE) - Ecuador", searchKeywords: ["guayaquil", "ecuador", "gye"] },
  { id: "EC-CUE", city: "Cuenca", country: "Ecuador", airportCode: "CUE", label: "Cuenca (CUE) - Ecuador", searchKeywords: ["cuenca", "ecuador", "cue"] },
  { id: "EC-MEC", city: "Manta", country: "Ecuador", airportCode: "MEC", label: "Manta (MEC) - Ecuador", searchKeywords: ["manta", "ecuador", "mec"] },

  // Uruguay
  { id: "UY-MVD", city: "Montevideo", country: "Uruguay", airportCode: "MVD", label: "Montevideo (MVD) - Uruguay", searchKeywords: ["montevideo", "uruguay", "mvd"] },
  { id: "UY-PDP", city: "Punta del Este", country: "Uruguay", airportCode: "PDP", label: "Punta del Este (PDP) - Uruguay", searchKeywords: ["punta del este", "uruguay", "pdp"] },
  { id: "UY-CYR", city: "Colonia del Sacramento", country: "Uruguay", airportCode: "CYR", label: "Colonia del Sacramento (CYR) - Uruguay", searchKeywords: ["colonia del sacramento", "colonia", "uruguay", "cyr"] },

  // Paraguay
  { id: "PY-ASU", city: "Asunción", country: "Paraguay", airportCode: "ASU", label: "Asunción (ASU) - Paraguay", searchKeywords: ["asuncion", "asunción", "paraguay", "asu"] },
  { id: "PY-AGT", city: "Ciudad del Este", country: "Paraguay", airportCode: "AGT", label: "Ciudad del Este (AGT) - Paraguay", searchKeywords: ["ciudad del este", "paraguay", "agt"] },
  { id: "PY-ENO", city: "Encarnación", country: "Paraguay", airportCode: "ENO", label: "Encarnación (ENO) - Paraguay", searchKeywords: ["encarnacion", "encarnación", "paraguay", "eno"] },

  // Bolivia
  { id: "BO-LPB", city: "La Paz", country: "Bolivia", airportCode: "LPB", label: "La Paz (LPB) - Bolivia", searchKeywords: ["la paz", "bolivia", "lpb"] },
  { id: "BO-VVI", city: "Santa Cruz de la Sierra", country: "Bolivia", airportCode: "VVI", label: "Santa Cruz de la Sierra (VVI) - Bolivia", searchKeywords: ["santa cruz", "santa cruz de la sierra", "bolivia", "vvi"] },
  { id: "BO-CBB", city: "Cochabamba", country: "Bolivia", airportCode: "CBB", label: "Cochabamba (CBB) - Bolivia", searchKeywords: ["cochabamba", "bolivia", "cbb"] },
  { id: "BO-SRE", city: "Sucre", country: "Bolivia", airportCode: "SRE", label: "Sucre (SRE) - Bolivia", searchKeywords: ["sucre", "bolivia", "sre"] },

  // Venezuela
  { id: "VE-CCS", city: "Caracas", country: "Venezuela", airportCode: "CCS", label: "Caracas (CCS) - Venezuela", searchKeywords: ["caracas", "venezuela", "ccs"] },
  { id: "VE-MAR", city: "Maracaibo", country: "Venezuela", airportCode: "MAR", label: "Maracaibo (MAR) - Venezuela", searchKeywords: ["maracaibo", "venezuela", "mar"] },
  { id: "VE-VLN", city: "Valencia", country: "Venezuela", airportCode: "VLN", label: "Valencia (VLN) - Venezuela", searchKeywords: ["valencia", "venezuela", "vln"] },
  { id: "VE-BRM", city: "Barquisimeto", country: "Venezuela", airportCode: "BRM", label: "Barquisimeto (BRM) - Venezuela", searchKeywords: ["barquisimeto", "venezuela", "brm"] },
  { id: "VE-MRD", city: "Mérida", country: "Venezuela", airportCode: "MRD", label: "Mérida (MRD) - Venezuela", searchKeywords: ["merida", "mérida", "venezuela", "mrd"] },

  // Panamá
  { id: "PA-PTY", city: "Ciudad de Panamá", country: "Panamá", airportCode: "PTY", label: "Ciudad de Panamá (PTY) - Panamá", searchKeywords: ["ciudad de panama", "ciudad de panamá", "panama", "panamá", "pty"] },
  { id: "PA-ONX", city: "Colón", country: "Panamá", airportCode: "ONX", label: "Colón (ONX) - Panamá", searchKeywords: ["colon", "colón", "panama", "panamá", "onx"] },
  { id: "PA-DAV", city: "David", country: "Panamá", airportCode: "DAV", label: "David (DAV) - Panamá", searchKeywords: ["david", "panama", "panamá", "dav"] },

  // Costa Rica
  { id: "CR-SJO", city: "San José", country: "Costa Rica", airportCode: "SJO", label: "San José (SJO) - Costa Rica", searchKeywords: ["san jose", "san josé", "costa rica", "sjo"] },
  { id: "CR-ALA", city: "Alajuela", country: "Costa Rica", airportCode: "ALA", label: "Alajuela (ALA) - Costa Rica", searchKeywords: ["alajuela", "costa rica", "ala"] },
  { id: "CR-HER", city: "Heredia", country: "Costa Rica", airportCode: "HER", label: "Heredia (HER) - Costa Rica", searchKeywords: ["heredia", "costa rica", "her"] },
  { id: "CR-CAR", city: "Cartago", country: "Costa Rica", airportCode: "CAR", label: "Cartago (CAR) - Costa Rica", searchKeywords: ["cartago", "costa rica", "car"] },

  // Guatemala
  { id: "GT-GUA", city: "Ciudad de Guatemala", country: "Guatemala", airportCode: "GUA", label: "Ciudad de Guatemala (GUA) - Guatemala", searchKeywords: ["ciudad de guatemala", "guatemala", "gua"] },
  { id: "GT-AGT", city: "Antigua Guatemala", country: "Guatemala", airportCode: "AGT", label: "Antigua Guatemala (AGT) - Guatemala", searchKeywords: ["antigua guatemala", "guatemala", "agt"] },
  { id: "GT-AAZ", city: "Quetzaltenango", country: "Guatemala", airportCode: "AAZ", label: "Quetzaltenango (AAZ) - Guatemala", searchKeywords: ["quetzaltenango", "guatemala", "aaz"] },

  // El Salvador
  { id: "SV-SAL", city: "San Salvador", country: "El Salvador", airportCode: "SAL", label: "San Salvador (SAL) - El Salvador", searchKeywords: ["san salvador", "el salvador", "sal"] },
  { id: "SV-SAZ", city: "Santa Ana", country: "El Salvador", airportCode: "SAZ", label: "Santa Ana (SAZ) - El Salvador", searchKeywords: ["santa ana", "el salvador", "saz"] },
  { id: "SV-SMG", city: "San Miguel", country: "El Salvador", airportCode: "SMG", label: "San Miguel (SMG) - El Salvador", searchKeywords: ["san miguel", "el salvador", "smg"] },

  // Honduras
  { id: "HN-TGU", city: "Tegucigalpa", country: "Honduras", airportCode: "TGU", label: "Tegucigalpa (TGU) - Honduras", searchKeywords: ["tegucigalpa", "honduras", "tgu"] },
  { id: "HN-SAP", city: "San Pedro Sula", country: "Honduras", airportCode: "SAP", label: "San Pedro Sula (SAP) - Honduras", searchKeywords: ["san pedro sula", "honduras", "sap"] },
  { id: "HN-LCE", city: "La Ceiba", country: "Honduras", airportCode: "LCE", label: "La Ceiba (LCE) - Honduras", searchKeywords: ["la ceiba", "honduras", "lce"] },

  // Nicaragua
  { id: "NI-MGA", city: "Managua", country: "Nicaragua", airportCode: "MGA", label: "Managua (MGA) - Nicaragua", searchKeywords: ["managua", "nicaragua", "mga"] },
  { id: "NI-GRA", city: "Granada", country: "Nicaragua", airportCode: "GRA", label: "Granada (GRA) - Nicaragua", searchKeywords: ["granada", "nicaragua", "gra"] },
  { id: "NI-LEO", city: "León", country: "Nicaragua", airportCode: "LEO", label: "León (LEO) - Nicaragua", searchKeywords: ["leon", "león", "nicaragua", "leo"] },

  // República Dominicana
  { id: "DO-SDQ", city: "Santo Domingo", country: "República Dominicana", airportCode: "SDQ", label: "Santo Domingo (SDQ) - República Dominicana", searchKeywords: ["santo domingo", "republica dominicana", "república dominicana", "sdq"] },
  { id: "DO-STI", city: "Santiago de los Caballeros", country: "República Dominicana", airportCode: "STI", label: "Santiago de los Caballeros (STI) - República Dominicana", searchKeywords: ["santiago de los caballeros", "republica dominicana", "república dominicana", "sti"] },
  { id: "DO-PUJ", city: "Punta Cana", country: "República Dominicana", airportCode: "PUJ", label: "Punta Cana (PUJ) - República Dominicana", searchKeywords: ["punta cana", "republica dominicana", "república dominicana", "puj"] },

  // Puerto Rico
  { id: "PR-SJU", city: "San Juan", country: "Puerto Rico", airportCode: "SJU", label: "San Juan (SJU) - Puerto Rico", searchKeywords: ["san juan", "puerto rico", "sju"] },
  { id: "PR-PSE", city: "Ponce", country: "Puerto Rico", airportCode: "PSE", label: "Ponce (PSE) - Puerto Rico", searchKeywords: ["ponce", "puerto rico", "pse"] },
  { id: "PR-BYM", city: "Bayamón", country: "Puerto Rico", airportCode: "BYM", label: "Bayamón (BYM) - Puerto Rico", searchKeywords: ["bayamon", "bayamón", "puerto rico", "bym"] },

  // Cuba
  { id: "CU-HAV", city: "La Habana", country: "Cuba", airportCode: "HAV", label: "La Habana (HAV) - Cuba", searchKeywords: ["la habana", "cuba", "hav"] },
  { id: "CU-SCU", city: "Santiago de Cuba", country: "Cuba", airportCode: "SCU", label: "Santiago de Cuba (SCU) - Cuba", searchKeywords: ["santiago de cuba", "cuba", "scu"] },
  { id: "CU-VRA", city: "Varadero", country: "Cuba", airportCode: "VRA", label: "Varadero (VRA) - Cuba", searchKeywords: ["varadero", "cuba", "vra"] },

  // Haití
  { id: "HT-PAP", city: "Puerto Príncipe", country: "Haití", airportCode: "PAP", label: "Puerto Príncipe (PAP) - Haití", searchKeywords: ["puerto principe", "puerto príncipe", "haiti", "haití", "pap"] },
  { id: "HT-CAP", city: "Cabo Haitiano", country: "Haití", airportCode: "CAP", label: "Cabo Haitiano (CAP) - Haití", searchKeywords: ["cabo haitiano", "haiti", "haití", "cap"] }
];

# Kelea. Digital Brain 🧠
Crea tu propio cerebro digital!
## Idea principal:
Captura rápida y organización inteligente de la información que generas a diario para transformar datos dispersos en
conocimiento útil y reutilizable, tu “Cerebro Digital”.
Resumen de la propuesta
El desafío consiste en diseñar un sistema de documentación personal que ayude a los usuarios a capturar
información de manera rápida y sencilla, procesarla posteriormente y convertirla en conocimiento estructurado y
reutilizable.
A lo largo del día, las personas generan todo tipo de información: apuntes de clase, enlaces, artículos, vídeos, notas de
voz, ideas sueltas… y el reto es evitar que esta información se pierda o quede desorganizada por la falta de tiempo,
concentración o motivación para ordenarla en el momento.
El sistema debe:
Permitir una captura rápida y sin interrupciones (un inbox único para todo tipo de entradas).
Ser capaz de identificar entradas, reconocer el tipo de contenido (texto, enlace, tarea, nota, vídeo…).
Posibilitar que la información se procese y organice en un momento posterior.
Separar inbox de información ya procesada, y almacenar esta información de forma estructurada en ficheros
(texto plano, markdown, etc.) o bases de datos.
Permitir la visualización o explotación del contenido: poder revisar, navegar y reutilizar el conocimiento generado.
El reto está diseñado para ser accesible a participantes con distintos niveles técnicos, desde estudiantes de primeros
cursos hasta perfiles más avanzados. Los puntos anteriores forman el núcleo mínimo que define el reto pero también
proponemos una serie de extras opcionales para equipos que quieran profundizar más en la solución.
Es libre en la implementación: los participantes pueden crear interfaces web, integraciones con herramientas
existentes (Obsidian, MkDocs, etc.) para la visualización de contenidos, o pipelines híbridos de IA y reglas para el
procesamiento de la información.
Lo importante es convertir información dispersa en conocimiento útil, organizado y reutilizable, sin que el usuario
pierda foco durante el proceso de captura.
## 📌 Descripción General
El reto consiste en diseñar y prototipar un sistema de documentación personal —un cerebro digital— que ayude a las
personas a capturar información sin fricción y a procesarla posteriormente de forma guiada.
En el día a día, especialmente en entornos de aprendizaje, trabajo técnico o creación, generamos continuamente
información valiosa: enlaces, artículos, fragmentos de texto, ideas rápidas, notas de voz o vídeos. El problema no es
capturar esa información, sino organizarla correctamente en el momento adecuado.
Este reto propone explorar el diseño de un sistema que permita reducir la la fricción cognitiva del proceso de
documentación, acompañando al usuario desde la captura rápida (inbox) hasta la transformación de esa información
en conocimiento estructurado y reutilizable.
A partir de este núcleo, los equipos pueden explorar cómo la automatización y la IA pueden ayudar a proponer
estructuras, resúmenes o relaciones, siempre manteniendo el control en manos de la persona.
🧩
Kelea. Digital Brain 🧠 1
## 🧩 El problema a resolver
El principal problema no es la falta de herramientas para organizar información, sino la fricción que supone hacerlo
mientras estamos concentrados en otra tarea.
Cuando estamos estudiando, trabajando o investigando:
Aparece una idea interesante.
Encontramos un enlace relevante.
Leemos un fragmento que queremos recordar.
Pensamos “esto me será útil más adelante”.
Organizar correctamente esa información en ese momento:
interrumpe el foco,
requiere tiempo y decisiones,
rompe el flujo de lo que estamos haciendo.
Para evitarlo, lo habitual es volcarlo todo en un “inbox” (una nota “TODO”, una carpeta sin ordenar, un gestor de
enlaces) con la intención de organizarlo más tarde.
El problema es que ese “más tarde”:
muchas veces nunca llega,
se pospone por pereza o falta de tiempo,
se vuelve abrumador conforme el inbox crece.
El resultado no es solo desorden, sino sistemas de documentación abandonados, no porque no aporten valor, sino
porque requieren demasiada energía cognitiva para mantenerse vivos.
👉 El verdadero reto es procesar la información sin perder foco ni motivación, reduciendo la fricción entre capturar y
organizar.
## 🎯 Objetivos del reto
Los objetivos del reto pueden abordarse a distintos niveles de profundidad, desde soluciones sencillas basadas en
reglas y estructuras claras, hasta propuestas más avanzadas que incorporen automatización o IA.
✅ Reducir la fricción y el esfuerzo mental asociados a capturar información durante el día, evitando interrupciones y
pérdida de concentración.
✅ Permitir transformar una colección caótica de entradas (enlaces, notas, ideas, audios, vídeos…) en conocimiento
estructurado y reutilizable.
✅ Diseñar un flujo claro y comprensible de captura, procesado y reutilización de la información, donde el usuario
mantenga el control sobre cómo se transforma los datos en conocimiento.
✅ Favorecer la construcción de una base de conocimiento personal viva, que crezca con el tiempo y sea útil para
aprender, decidir o crear.
🛠️ Características del proyecto
Kelea. Digital Brain 🧠 2
A continuación se describen componentes y comportamientos esperados del sistema. No son obligatorios, sólo una
guía para orientar el diseño; y pueden abordarse a distintos niveles de profundidad.
📥 Inbox unificado de captura
Un punto único de entrada para capturar cualquier tipo de información:
Texto rápido
Enlaces
Ideas sueltas
Notas de voz
Código
Referencias a vídeos o artículos
La captura debería ser sencilla e inmediata, sin necesidad de clasificar, etiquetar o decidir nada en ese momento:
pegar un enlace a un artículo o un vídeo, escribir una nota…
Todas las entradas se muestran como una lista de elementos pendientes de procesar, permitiendo al usuario
seguir con lo que estaba haciendo.
## 🏷️ Identificación básica de entradas
La solución debe ser capaz de reconocer el tipo de contenido de los elementos introducidos (texto, enlace,
código, tarea, nota, vídeo…).
Inbox semántico: clasificación de cada bloque de información (contenido, tipo, origen, fecha, estado…).
## 🗂️ Organización del conocimiento
El sistema debe ayudar a transformar las entradas en conocimiento estructurado:
Notas permanentes
Documentación técnica
Apuntes de estudio
Ideas conectadas entre sí
Se anima a inspirarse en sistemas de organización del conocimiento, como:
Zettelkasten / Evergreen Notes
PARA / Second Brain (CODE)
Cornell, Outline, mapas mentales, etc.
No es obligatorio seguir ninguno en concreto; pueden combinarse o crear uno nuevo.
## 💾 Almacenamiento abierto y controlado
Se prioriza el uso de formatos abiertos (Markdown, texto plano) y estructuras de almacenamiento versionables,
como repositorios de archivos, por ejemplo “Mi cerebro digital vive en una carpeta versionada con Git, llena de
Markdown”. Por supuesto, también puedes usar bases de datos, preferiblemente en local.
El usuario debe poder:
Acceder a su información sin dependencias fuertes
Reutilizarla en otras herramientas
Entender dónde y cómo se guarda su conocimiento
👀 Visualización y destino del conocimiento generado (opcional)
El sistema debe ofrecer una forma clara de:
Revisar la información procesada
Kelea. Digital Brain 🧠 3
Navegar por el conocimiento generado
Detectar conexiones o patrones
Para facilitar un desarrollo rápido y centrar el esfuerzo en la captura y procesado, los equipos pueden reutilizar
herramientas existentes basadas en Markdown como capa final de visualización y validación:
Obsidian / Logseq – cerebros digitales interconectados.
MkDocs / Docusaurus – documentación estructurada.
Repositorios Markdown locales.
Alternativamente, los equipos pueden desarrollar un frontal web propio si consideran que la experiencia de usuario es
parte central de su propuesta.
👉 No es obligatorio construir una interfaz propia.
🚀 Capas opcionales (para los que quieren ir un paso más allá)
Los equipos que lo deseen, además de la clasificación y organización básicas, pueden añadir funcionalidades
avanzadas, que en algunos casos podrían estar asistidas por IA.🤖
Inbox
Detección de estructuras y relaciones entre inputs cercanos (listas de tareas, agrupaciones temáticas, fuente de
datos...): “parece que has escrito una lista de tareas ¿quieres que lo tratemos así?
Generación de vistas previas de enlaces “link previews”
Posibilidad de edición
Edición avanzada con Markdown o WYSIWYG
Procesamiento de la información
Sería interesante crear automatismos que analicen el contenido del inbox y puedan proponer:
Resúmenes o transcripciones: “el contenido parece extenso, ¿quieres que te proponga un resumen?”
Reformulación de notas: “¿Quieres transformar esta nota rápida en una versión más clara o estructurada?”
OCR de imágenes o PDFs: “Se ha detectado texto en una imagen o documento, ¿quieres extraerlo para poder
trabajarlo?”
Extracción de contenido de enlaces (web scraping): “Este enlace contiene un artículo o documentación, ¿quieres
extraer su contenido relevante para trabajarlo como una nota?”
Relaciones entre contenidos nuevos o ya existentes en el Cerebro Digital (enlaces tipo web o wiki, enlaces
Markdown al estilo Zettelkasten, relaciones conceptuales mediante tags o metadatos): “esto parece relacionado
con…”
Consulta o explotación posterior de los datos
Navegación y consulta del contenido generado
Análisis y detección de contenidos duplicados
Consulta semántica o recuperación de información
Preguntas automáticas de reflexión
Notificaciones y señales del sistema
Información sobre el estado del inbox y del conocimiento: entradas pendientes de procesar, acumulación prolongada,
oportunidades de agrupación o relación, y sugerencias suaves de revisión.
Procesamiento y consulta asistidos por IA 🤖
Kelea. Digital Brain 🧠 4
En cualquiera de los puntos anteriores, la IA podría resultar muy útil, por ejemplo:
1. Clasifica
Tema
Tipo de conocimiento
Grado de abstracción
2. Decide el destino
¿Proyecto?
¿Nota Zettelkasten?
¿Recurso?
¿Nueva categoría?
3. Propone acciones
Crear nota Markdown
Enlazar con existentes
Crear índice
Sugerir resumen / gráfico / mapa
Lo importante es el flujo humano–IA y la transformación de información en conocimiento:
Clasifica → Decide destino → Propone acciones → Explota contenido
💡 ¿Vamos a hacer uso de la IA?
En caso afirmativo el enfoque debe estar en mantener un flujo claro humano–IA, donde la inteligencia
artificial propone estructuras, relaciones o resúmenes, pero el control y la validación siempre quedan en
manos del usuario.
IA propone → persona valida, corrige o descarta
🛠️ Tecnologías Sugeridas
Las siguientes tecnologías se proponen únicamente como guía orientativa para facilitar el arranque de los equipos.
Núcleo del sistema
Lenguajes: aceptamos todo tipo de lenguajes
Almacenamiento. Aceptamos todo tipo de bases de datos y ficheros:
Información estructurada: JSON, bases de datos SQL sencillas
Notas y documentación: Markdown, ficheros locales
Backend e interfaz: FastAPI, Express, Streamlit, React…
Propósito: construir rápidamente el flujo principal del sistema sin añadir complejidad innecesaria.
Lógica y automatización (opcional)
Muchas funcionalidades interesantes pueden implementarse sin IA, utilizando:
reglas y heurísticas,
parsing básico de texto,
expresiones regulares,
metadatos explícitos (tipo de contenido, origen, estado, fecha).
Kelea. Digital Brain 🧠 5
Este enfoque es totalmente válido y suficiente para resolver el reto con calidad.
Capas opcionales – IA y automatización avanzada
Para los equipos que quieran explorar funcionalidades más avanzadas, se pueden añadir capas asistidas por IA.
Soluciones integrales: Weaviate, Chroma (en local)
Útiles para combinar almacenamiento, búsqueda semántica y conexión con LLMs con menos esfuerzo de
integración.
LLMs (uso puntual vía API): OpenAI, Anthropic, Groq, Together
Uso recomendado para tareas como resumen, reformulación, clasificación o sugerencia de acciones.
Modelos locales ligeros (opcional): LLaMA 3.x, Mistral, Qwen, Phi-3
Ejecución local: Ollama, LM Studio
Embeddings (solo si son necesarios): APIs integradas o modelos ligeros
Propósito: generar representaciones numéricas del contenido que reflejan su significado, permitiendo identificar
notas similares, descubrir relaciones entre ideas y agrupar contenido de forma inteligente.
⚠️ Disclaimer
El reto no requiere usar IA ni ninguna tecnología concreta.
Se valorará especialmente la claridad del flujo, las decisiones de diseño y cómo la solución transforma
información en conocimiento útil.
Caso práctico, ejemplo
🧑‍🎓 Infografía textual: Estudiante de informática
Este ejemplo ilustra una posible implementación avanzada del reto.
No es un modelo a replicar, sino una referencia conceptual.
DÍA DE ESTUDIO DE MARÍA
1️⃣ CAPTURA DE INFORMACIÓN (Inbox Único)
----------------------------------------
Durante la clase / investigación / estudio, María captura:
- Una nota rápida: "Round-robin → quantum demasiado grande ≈ FIFO"
- Enlaces a documentación
- Artículos y vídeos técnicos
- Ideas y fragmentos de código
👉 Se vuelcan en un único punto de entrada
👉 No es necesario clasificar ni procesar en el momento
👉 Aparecen como una lista de entradas pendientes
---
Kelea. Digital Brain 🧠 6
2️⃣ MOMENTO DE PROCESADO (cuando decide)
----------------------------------------
María abre el sistema por la tarde y selecciona:
"Procesar entradas de hoy"
---
3️⃣ PROCESAMIENTO DE LA INFORMACIÓN
-----------------------
El sistema analiza el inbox y propone:
- Agrupación por temas: "Planificación de procesos"
- Detección de relaciones entre entradas similares
- Resumen general:
 > "Comparativa entre FIFO, Round-Robin y prioridades"
- Propuesta de estructura en Markdown:
 - Concepto
 - Ejemplo
 - Ventajas / Desventajas
 - Referencias
👉 El sistema **no guarda nada automáticamente**, solo sugiere
---
4️⃣ VALIDACIÓN HUMANA
--------------------
María revisa las propuestas:
- Acepta la estructura sugerida
- Corrige definiciones o agrega ejemplos
- Descarta relaciones irrelevantes
✅ Resultado: notas procesadas y conectadas, listas para estudio
---
5️⃣ ALMACENAMIENTO Y REUTILIZACIÓN
----------------------------------
- Guardado en Markdown dentro de carpeta de la asignatura
- Navegación por conceptos relacionados
- Reutilización en otros contextos
- El conocimiento evoluciona y se conserva, no se pierde
---
🎯 CLAVES DEL EJEMPLO
---------------------
- Separar captura rápida y procesamiento posterior
- Evitar interrupciones durante el aprendizaje
- El sistema propone, el humano valida
- Convertir información dispersa en conocimiento útil y reutilizable
Kelea. Digital Brain 🧠 7
Sistemas de referencia para organización del conocimiento
El reto no impone un sistema concreto. Se proponen algunos marcos de referencia que pueden servir como base para
el procesamiento del inbox:
Zettelkasten / Evergreen Notes
Notas atómicas interconectadas, ideales para transformar ideas sueltas en conocimiento a largo plazo.
PARA (Projects, Areas, Resources, Archive)
Clasificación orientada a la utilidad práctica: ¿para qué me servirá esto?
Building a Second Brain (CODE)
Capturar, organizar, destilar y expresar conocimiento.
Cornell / Outline
Estructuración de apuntes para estudio.
Mapas mentales o grafos de conocimiento
Exploración visual de relaciones.
Los equipos pueden combinarlos, adaptarlos o proponer un sistema propio.
Librerías de referencia que pueden resultar útiles
Esta página recopila librerías útiles que os pueden servir de inspiración para implementar funcionalidades clave del
reto sin necesidad de IA avanzada, o como apoyo a capas opcionales más sofisticadas.
El objetivo es ayudar a los equipos a:
empezar rápido,
elegir herramientas acordes a su nivel técnico,
y evitar soluciones demasiado pesadas para el tiempo disponible.
Las librerías se agrupan por lenguaje y se acompañan de una breve explicación de:
su propósito,
dificultad de uso,
impacto en rendimiento / peso,
y enlace al proyecto.
⚠️ Todas las librerías pueden instalarse como dependencias en proyectos Node.js o Python.
Algunas funcionalidades (OCR, transcripción) pueden requerir herramientas externas o modelos adicionales,
lo cual es habitual y totalmente válido dentro del reto.
🐍 Python
Kelea. Digital Brain 🧠 8
Librería
Funcionalidad
principal
Propósito en el
reto
Dificultad
Peso /
rendimiento
URL
pytesseract OCR
Extraer texto
de imágenes o
PDFs
escaneados
Media (requiere
Tesseract
instalado)
Ligero, CPU https://github.com/madmaze/pytesseract
easyocr OCR
OCR más
robusto sin
configurar
Tesseract
Media Más pesado
(DL)
https://github.com/JaidedAI/EasyOCR
pdfplumber PDFs
Extraer texto,
tablas y
páginas de
PDFs
Baja Ligero https://github.com/jsvine/pdfplumber
Vosk Transcripción
Speech-to-text
offline Media Ligero–medio https://alphacephei.com/vosk
Sumy Resúmenes
Resúmenes
extractivos
(TextRank,
LSA…)
Baja Ligero https://github.com/miso-belica/sumy
Gensim
Resúmenes /
similitud
TextRank, TFIDF, similitud
básica
Media Medio https://radimrehurek.com/gensim
scikit-learn Clasificación /
similitud
TF-IDF,
clustering,
cosine
similarity
Media Medio https://scikit-learn.org
rapidfuzz Similaridad
Detección de
duplicados /
textos similares
Baja Muy ligero https://github.com/maxbachmann/RapidFuzz
markdown-itpy
Parsing
Markdown
Detectar listas,
bloques,
estructura
Baja Ligero
https://github.com/executablebooks/markdow
it-py
networkx Relaciones
Representar
notas como
grafos
Media Ligero https://networkx.org
newspaper3k URLs / artículos
Extraer
contenido de
enlaces
Baja Ligero https://github.com/codelucas/newspaper
langextract
Extracción de
texto de HTML
/ PDFs / otros
formatos
Extraer texto
principal de
páginas y
documentos
como punto de
partida para
resúmenes o
procesamiento
Media Ligero https://github.com/google/langextract
🟨 JavaScript / TypeScript
Librería
Funcionalidad
principal
Propósito en el
reto Dificultad
Peso /
rendimiento URL
tesseract.js OCR
OCR en
navegador o
Node
Media Medio https://tesseract.projectnaptha.com
node-tesseract-ocr OCR
Wrapper Node
de Tesseract
Media Medio
https://github.com/zapolnoch/nodetesseract-ocr
vosk-browser /
node-vosk
Transcripción
Speech-to-text
offline en JS Media Medio
https://github.com/ccoreilly/voskbrowser
Kelea. Digital Brain 🧠 9
Librería
Funcionalidad
principal
Propósito en el
reto
Dificultad
Peso /
rendimiento
URL
node-summarizer Resúmenes
Resúmenes
extractivos
simples
Baja Ligero
https://www.npmjs.com/package/nodesummarizer
remark / remarkparse Markdown
Detectar listas,
headings,
bloques
Media Ligero https://remark.js.org
markdown-it Markdown
Parsing
estructural de
texto
Baja Ligero
https://github.com/markdownit/markdown-it
natural NLP clásico
TF-IDF,
clasificación,
similitud
Media Medio https://github.com/NaturalNode/natural
wink-nlp NLP ligero
Tokenización,
keywords,
análisis básico
Media Ligero https://github.com/winkjs/wink-nlp
fuse.js Similaridad
Búsqueda
fuzzy /
detección de
similares
Baja Ligero https://fusejs.io
string-similarity Similaridad
Comparación
rápida de
textos
Baja Muy ligero
https://www.npmjs.com/package/string
similarity
link-preview-js URLs
Generar
previews de
enlaces
Baja Ligero
https://github.com/ospfranco/linkpreview-js
@mozilla/readability
Extracción de
contenido web
Obtener texto
principal de
artículos HTML
Media Ligero https://github.com/mozilla/readability
graphlib Relaciones
Modelar
conocimiento
como grafo
Media Ligero https://github.com/dagrejs/graphlib
Criterios de Evaluación
El reto puede abordarse a distintos niveles de complejidad.
Todos los equipos serán evaluados sobre el núcleo del reto y, adicionalmente, se valorarán las capas opcionales que
hayan decidido explorar.
1️⃣ Captura y flujo de información (Núcleo del reto)
Rapidez y facilidad de captura:
¿El usuario puede registrar información de forma rápida y sin perder el foco?
¿El sistema permite un punto de entrada único para todo tipo de información (texto, enlaces, ideas, vídeos,
notas de voz…)?
¿Se evita la necesidad de clasificar o decidir en el momento de la captura?
Capacidad para reconocer y explotar diferentes fuentes de información: texto, ficheros, imágenes, enlaces,
vídeos…
Kelea. Digital Brain 🧠 10
Gestión de la “acumulación” de entradas:
¿El sistema maneja eficientemente entradas pendientes de procesar?
¿Permite revisarlas, filtrarlas o agruparlas sin abrumar al usuario?
Separación captura–procesado:
¿El flujo entre capturar y procesar es claro y comprensible?
¿El sistema permite capturar sin interrumpir el aprendizaje o trabajo?
¿Existe un momento explícito para revisar y transformar lo capturado?
2️⃣ Procesado y estructuración del conocimiento (Núcleo del reto)
Transformación de entradas en conocimiento
¿El sistema ayuda a convertir entradas caóticas en información estructurada?
¿Se generan notas, documentos, apuntes o unidades de conocimiento reutilizables?
Criterio y coherencia del sistema
¿Existe una lógica clara de organización (por temas, proyectos, fechas, tipos de nota…)?
¿El sistema elegido tiene sentido para el caso de uso propuesto?
Reutilización futura
¿El conocimiento generado es comprensible semanas después?
¿Puede reutilizarse para estudiar, trabajar o crear?
3️⃣ Relaciones, navegación y exploración (Núcleo ampliado)
Este bloque evalúa cómo el conocimiento deja de ser una lista de ficheros y pasa a comportarse como un cerebro
digital interconectado.
Relaciones entre contenidos
¿Los conocimientos almacenados pueden relacionarse entre sí?
¿Existen enlaces, referencias cruzadas, tags o metadatos?
¿Se pueden conectar contenidos nuevos con otros ya existentes?
Navegación
¿Es posible recorrer el conocimiento generado de forma no lineal?
¿El sistema facilita descubrir conexiones o agrupar ideas relacionadas?
4️⃣ Capas opcionales: automatización e IA (Para ir un paso más allá)
⚠️ Este bloque es completamente opcional y está pensado para equipos que quieran aumentar la ambición técnica
de su propuesta.
Procesamiento asistido
¿El sistema propone resúmenes, transcripciones u otras transformaciones que facilitan revisar grandes volúmenes
de información?
¿Las propuestas automáticas ayudan realmente a reducir el esfuerzo del usuario durante el procesado?
¿El procesamiento asistido está bien integrado en el flujo general del sistema?
Relaciones y estructura sugeridas
¿El sistema es capaz de sugerir relaciones entre contenidos nuevos y existentes?
¿Las sugerencias de agrupación, similitud o conexión tienen sentido para el caso de uso propuesto?
¿El usuario puede aceptar, modificar o descartar estas sugerencias de forma sencilla?
Kelea. Digital Brain 🧠 11
Diseño del flujo humano–IA
¿Se respeta claramente el principio “la IA propone, la persona valida”?
¿La automatización o la IA actúan como apoyo y no como sustituto del criterio humano?
¿El usuario puede corregir, descartar o modificar las sugerencias?
¿El usuario entiende qué parte del contenido ha sido generada o sugerida automáticamente y por qué?
Valor añadido de la automatización
¿El uso de automatización o IA aporta un beneficio claro frente a una solución manual?
¿La complejidad técnica introducida está justificada por el valor que aporta al usuario?
¿La solución sigue siendo comprensible y usable incluso sin conocer los detalles técnicos internos?
5️⃣ Almacenamiento, accesibilidad y control (Núcleo del reto)
Formatos abiertos y control del usuario:
¿La información se guarda en formatos duraderos y portables, como Markdown, ficheros locales o bases de
datos simples bajo control del usuario?
¿El usuario mantiene control sobre dónde y cómo se almacena su conocimiento?
Visualización y navegación de contenidos:
¿Es sencillo revisar el conocimiento acumulado, independientemente del mecanismo de almacenamiento
elegido?
¿Permite identificar conexiones, agrupaciones y temas relevantes de forma clara?
¿La visualización es coherente con el sistema propuesto y facilita la reutilización del conocimiento?
6️⃣ Impacto potencial
Reducción de esfuerzo y fricción:
¿El sistema disminuye la carga cognitiva que supone organizar información mientras se aprende o trabaja?
¿Evita que el usuario posponga indefinidamente la organización de notas y referencias?
Valor para el aprendizaje o trabajo:
¿El sistema ayuda al usuario a generar conocimiento reutilizable?
¿Contribuye a la construcción de una base de conocimiento viva y útil?
7️⃣ Adicional
Innovación y creatividad: soluciones originales en el flujo humano–IA, representación de información o interfaz.
Usabilidad: claridad de interacción, facilidad de uso y comprensión del sistema.
Presentación: claridad de la propuesta, documentación y demostración del prototipo.
Ejemplos de “buenas soluciones” vs. anti-patrones
✅ Ejemplos de buenas soluciones
Un sistema que:
captura enlaces y notas,
propone resúmenes y relaciones,
genera notas Markdown enlazadas en Obsidian,
Kelea. Digital Brain 🧠 12
y permite al usuario validar antes de guardar.
Un flujo donde:
la IA propone estructura (por ejemplo, PARA o Zettelkasten),
el usuario ajusta,
y el resultado se visualiza en MkDocs como documentación viva.
Una solución sencilla pero clara:
poco frontend,
foco en el proceso,
conocimiento reutilizable tras el hackathon.
🚫 Anti-patrones (lo que no se busca)
Un chat bonito que:
genera texto,
pero no deja rastro ni estructura.
Un frontend complejo:
con mucho diseño,
pero sin un sistema claro de conocimiento detrás.
Automatización total:
la IA decide todo,
el usuario no entiende qué se guarda ni por qué.
Sistemas cerrados:
datos no exportables,
formatos opacos,
sin posibilidad de reutilización real.
FAQ - Preguntas Frecuentes
¿Qué se espera exactamente que construyamos?
Un prototipo (técnico o conceptual bien explicado) de un sistema de documentación personal, pensado para capturar
información de forma rápida y transformarla posteriormente en conocimiento estructurado y reutilizable.
No se espera un producto final ni una herramienta lista para producción, sino una idea clara, con un flujo diseñado y
demostrable.
El sistema puede centrarse en una parte concreta del proceso (captura, procesamiento, organización, visualización),
siempre que la propuesta sea coherente y se entienda cómo encaja en un “cerebro digital”.
En propuestas más avanzadas, el sistema puede incorporar automatización o IA para asistir en el procesado y la
organización del conocimiento.
¿Tenemos que organizar la información en el momento de capturarla?
No.
Kelea. Digital Brain 🧠 13
El reto parte precisamente de la idea de que organizar en el momento suele interrumpir el foco y acabar
posponiéndose indefinidamente.
La propuesta consiste en separar claramente dos fases:
Captura rápida, donde el usuario simplemente registra la información sin tomar decisiones.
Procesado posterior, cuando el usuario decide revisar y estructurar lo capturado.
Este procesado puede ser:
manual,
basado en reglas,
o asistido por automatización o IA, según el nivel de la propuesta.
¿Es obligatorio usar IA en el reto?
No.
La IA no forma parte del núcleo obligatorio del reto.
Un sistema bien diseñado, con una buena estructura de conocimiento y un flujo claro, puede obtener una muy buena
valoración sin utilizar IA.
El uso de automatización o IA se considera una capa opcional, pensada para equipos que quieran ir un paso más allá.
Entonces, ¿para qué sirve la IA en este reto?
En propuestas más avanzadas, la IA puede ayudar a:
resumir contenidos,
proponer estructuras,
detectar relaciones entre notas,
asistir en el procesado de grandes volúmenes de información.
Siempre bajo el principio:
la automatización propone, la persona valida.
¿La automatización o la IA tienen que intervenir en cada entrada?
No necesariamente.
La asistencia automática puede aplicarse:
Solo a determinados tipos de entrada,
Únicamente durante algún tipo de procesado,
o únicamente cuando el usuario lo decide.
El objetivo no es que todas las entradas pasen por automatización o IA, sino reducir fricción y esfuerzo en los
momentos donde aporta más valor.
¿En qué se diferencia este reto de una aplicación de notas tradicional?
La diferencia no está tanto en la captura de información como en el proceso posterior.
El foco del reto está en cómo transformar una colección de entradas capturadas de forma rápida en conocimiento
estructurado, conectado y reutilizable, sin exigir al usuario esfuerzo constante en el momento en que ocurre el
aprendizaje.
Kelea. Digital Brain 🧠 14
¿Qué pasa si el usuario acumula mucha información sin procesar?
El sistema debe asumir que esto ocurrirá. En la práctica, es habitual acumular información durante días o semanas.
Parte del reto consiste precisamente en diseñar mecanismos que ayuden a procesar grandes volúmenes de entradas
sin que la tarea resulte abrumadora.
Estos mecanismos pueden ser:
manuales,
estructurales,
o asistidos mediante automatización o IA.
¿Debe ser una aplicación completa con frontend propio?
No.
Podéis:
Usar herramientas existentes como Obsidian, MkDocs, repositorios Markdown, etc., como capa de visualización.
O desarrollar vuestro propio frontal si la experiencia de usuario es clave en vuestra propuesta.
👉 No se penaliza no hacer frontend propio.
Dicho esto, sí es recomendable prestar especial atención a la experiencia de captura (inbox), ya que es el punto donde
una interfaz sencilla y bien pensada puede reducir significativamente la fricción del sistema.
Esto puede resolverse con:
un frontend mínimo,
una pequeña interfaz web,
una app sencilla,
o incluso una CLI o formulario simple.
¿Qué tipo de información debe gestionar el sistema?
La que tenga sentido para vuestro caso de uso. Por ejemplo:
Anotaciones, ideas.
Documentación técnica.
Enlaces a artículos, vídeos, posts…
Tareas.
Notas de voz.
Lo importante es que:
El tipo de conocimiento esté bien definido.
El sistema propuesto sea coherente con ese objetivo.
¿Es obligatorio usar alguno de los sistemas de organización propuestos (Zettelkasten, PARA,
etc.)?
No.
Son referencias conceptuales, no requisitos.
Los equipos pueden::
Usar uno tal cual.
Kelea. Digital Brain 🧠 15
Adaptarlos.
Combinar varios.
Diseñar vuestro propio sistema.
Se valorará que el sistema elegido tenga sentido y esté bien justificado.
¿Es obligatorio usar IA generativa (LLMs), RAG o bases vectoriales?
No.
Estas tecnologías pueden ser útiles para:
Asistir en el procesado avanzado.
Detectar similitudes entre notas.
Recuperar conocimiento previo al procesar nuevas entradas.
Proponer conexiones entre contenidos.
Mantener contexto a largo plazo.
Pero no son imprescindibles.
También es perfectamente válido trabajar con almacenamiento simple y procesamiento directo si el diseño del sistema
lo justifica.
¿La IA puede automatizar todo el proceso?
No es lo deseable.
El núcleo del reto no es la automatización total, sino el diseño de un sistema de conocimiento comprensible y
controlable por la persona.
Incluso en propuestas que incorporan automatización o IA, se espera que:
El usuario entienda qué ocurre con su información.
Pueda corregir o ajustar lo propuesto.
Mantenga el control sobre el conocimiento final.
¿Qué nivel técnico se espera?
Muy variable, y eso es intencional.
Se valoran:
Buenas ideas.
Claridad conceptual.
Coherencia del sistema.
No se espera:
Código perfecto.
Arquitecturas complejas.
Sistemas listos para producción.
¿Qué se valorará más: la complejidad técnica o la idea?
La idea y su potencial, junto con:
El diseño del sistema.
La coherencia del sistema de conocimiento.
La claridad de la propuesta.
La complejidad técnica suma, pero no es el único factor.
Kelea. Digital Brain 🧠 16
¿El sistema debe funcionar con datos reales del usuario?
No necesariamente.
Podéis trabajar con:
Datos simulados.
Ejemplos.
Casos ficticios bien explicados.
¿Podemos enfocarlo a un público concreto (estudiantes, desarrolladores, investigadores…)?
Sí, y es incluso recomendable.
Definir bien el público suele mejorar mucho la calidad de la propuesta.
¿Qué pasa si nuestra solución es muy conceptual?
No hay problema, siempre que:
El concepto esté bien explicado.
El flujo esté claro.
Se entienda cómo funcionaría en la práctica.
Kelea. Digital Brain 🧠 17
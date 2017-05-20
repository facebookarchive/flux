# Learnings
- careful about how you import! if you export something as default but then use named syntax for importing, you won't get your item! (undefined)
- only place that should have knowledge of flux is the container, so anything the view needs should be passed down from the container
  - note: view doesn't dispatch actions directly - easier to reuse, test, change views (more modular)

# TODOS
- use strict at top of each module?
- why do I have to refresh? shouldn't it hot reload automatically?
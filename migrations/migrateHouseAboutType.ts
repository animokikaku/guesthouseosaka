import { at, defineMigration, set } from 'sanity/migrate'

// House About moved from `internationalizedArrayPortableText` to
// `internationalizedArrayHousePortableText`, so each locale entry is retyped to match.
export default defineMigration({
  title: 'Retype house About entries',
  documentTypes: ['house'],
  migrate: {
    object(node, path) {
      if (
        path.length === 2 &&
        path[0] === 'about' &&
        node._type === 'internationalizedArrayPortableTextValue'
      ) {
        return at('_type', set('internationalizedArrayHousePortableTextValue'))
      }
    }
  }
})

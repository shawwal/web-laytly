// utils/slugify.ts

export function generateSlug(title: string): string {
    return title
      .toLowerCase()                              // Convert to lowercase
      .replace(/\s+/g, '-')                        // Replace spaces with dashes
      .replace(/[^\w\-]+/g, '')                    // Remove all non-alphanumeric characters (except dashes)
      .replace(/\-\-+/g, '-')                      // Replace multiple dashes with a single dash
      .replace(/^-+/, '')                          // Trim leading dashes
      .replace(/-+$/, '');                         // Trim trailing dashes
  }
  
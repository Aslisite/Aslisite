const API_URL = 'https://sheetdb.io/api/v1/ddub5agvnxhso';

export const isPublishedBlog = (blog) => {
  return (
    blog?.status?.toLowerCase() === 'deployed' &&
    Boolean(blog?.title?.trim()) &&
    Boolean(blog?.slug?.trim()) &&
    Boolean(blog?.content?.trim())
  );
};

const getBlogTimestamp = (blog) => {
  const candidate = blog?.updatedAt || blog?.date || blog?.publishedAt || blog?.createdAt;
  const timestamp = Date.parse(candidate);
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

export const sortBlogsByRecent = (blogs = []) => {
  return [...blogs].sort((a, b) => {
    const delta = getBlogTimestamp(b) - getBlogTimestamp(a);
    if (delta !== 0) return delta;

    return (b?.title || '').localeCompare(a?.title || '');
  });
};

export const filterPublishedBlogs = (blogs = []) => {
  return sortBlogsByRecent(blogs.filter(isPublishedBlog));
};

export const getBlogs = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch blogs: ${response.statusText}`);
    }
    const data = await response.json();
    return filterPublishedBlogs(data);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    throw error;
  }
};

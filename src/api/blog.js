const API_URL = 'https://sheetdb.io/api/v1/ddub5agvnxhso';

export const isPublishedBlog = (blog) => {
  return (
    blog?.status?.toLowerCase() === 'deployed' &&
    Boolean(blog?.title?.trim()) &&
    Boolean(blog?.slug?.trim()) &&
    Boolean(blog?.content?.trim())
  );
};

export const filterPublishedBlogs = (blogs = []) => {
  return blogs.filter(isPublishedBlog);
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

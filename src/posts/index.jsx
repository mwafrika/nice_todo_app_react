// src/App.jsx
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const App = () => {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingPostId, setEditingPostId] = useState(null);
  const navigate = useNavigate();

  axios.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${localStorage.getItem("token")}`;
  axios.defaults.baseURL = "http://localhost:7000";

  const fetchPosts = async () => {
    try {
      const response = await axios.get("/api/posts");
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const createPost = async () => {
    try {
      const newPost = await axios.post("/api/posts", { title, content });
      fetchPosts();
      setTitle("");
      setContent("");
      toast.success(newPost.data.message);
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  const deletePost = async (postId) => {
    try {
      const deletedPost = await axios.delete("/api/posts", {
        data: { postId },
      });
      fetchPosts();
      toast.success(deletedPost.data.message);
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  const isEditing = (postId) => editingPostId === postId;

  const toggleEditMode = (postId) => {
    if (isEditing(postId)) {
      // Save edited post
      saveEditedPost();
    } else {
      // Switch to edit mode for the post
      const postToEdit = posts.find((post) => post._id === postId);
      if (postToEdit) {
        setTitle(postToEdit.title);
        setContent(postToEdit.content);
        setEditingPostId(postId);
      }
    }
  };

  const saveEditedPost = async () => {
    try {
      if (!editingPostId) {
        return;
      }

      const editedPost = await axios.put(`/api/posts`, {
        title,
        content,
        postId: editingPostId,
      });

      fetchPosts();

      // Clear the form and reset the editing state
      setTitle("");
      setContent("");
      setEditingPostId(null); // Reset editingPostId after successful update
      toast.success(editedPost.data.message);
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  const cancelEditing = () => {
    setEditingPostId(null);
    setTitle("");
    setContent("");
    toast.info("Editing cancelled");
  };

  const logout = () => {
    localStorage.removeItem("token");
    toast.success("You are now logged out");
    navigate("/login");
  };

  React.useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen w-screen flex items-center justify-center">
      <div className="max-w-3xl my-5 w-1/3 mx-auto py-4 shadow-lg px-4 bg-white rounded">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Todo App</h1>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Logout
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (editingPostId) {
              // Save edited post
              saveEditedPost();
            } else {
              // Create new post
              createPost();
            }
          }}
        >
          <div className="mb-4">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="px-4 py-2 border rounded w-full"
            />
          </div>
          <div className="mb-4">
            <textarea
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="px-4 py-2 border rounded w-full"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            {editingPostId ? "Save Post" : "Create Post"}
          </button>
          {editingPostId && (
            <button
              type="button"
              onClick={cancelEditing}
              className="px-4 py-2 bg-red-500 text-white rounded ml-2"
            >
              Cancel
            </button>
          )}
        </form>
        <div className="mt-8">
          {posts.map((post) => (
            <div key={post._id} className="border p-4 mb-4">
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p>{post.content}</p>
              <button
                onClick={() => deletePost(post._id)}
                className="px-4 py-2 bg-red-500 text-white rounded mt-2"
              >
                Delete
              </button>
              <button
                onClick={() => toggleEditMode(post._id)}
                className="px-4 py-2 bg-green-500 text-white rounded mt-2 ml-2"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;

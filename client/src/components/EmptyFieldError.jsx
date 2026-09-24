const EmptyFieldError = ({ message }) => {
  if (!message) return null;
  
  return (
    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg">
      <p className="font-medium">{message}</p>
    </div>
  );
};

export default EmptyFieldError;

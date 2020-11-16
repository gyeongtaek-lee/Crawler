class CrawlerError extends Error {
	
  constructor(message) {
	  
	  super(message);
	  
	  // Ensure the name of this error is the same as the class name
	  this.name = this.constructor.name;
	  
	  // @see Node.js reference (bottom)
	  Error.captureStackTrace(this, this.constructor);
	  
  }
  
};

class ContentNotFoundError extends CrawlerError {

	constructor(content) {
		
		super(`Content ${content} was not found.`);
		
		this.data = { content };
		
	}
	
};

class TargetNotAccessError extends CrawlerError {

	constructor(content) {
		
		super(`Target ${content} was not access.`);
		
		this.data = { content };
		
	}
	
};

// do something like this to wrap errors from other frameworks.
class InternalError extends CrawlerError {
 
	constructor(error) {
		
		super(error.message);
		
		this.data = { error };
		
	}
	
};

module.exports = {
		ContentNotFoundError,
		TargetNotAccessError,
		InternalError
};
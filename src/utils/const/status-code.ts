export enum StatusCode {
    // Success
    OK = 200, // Successful request and response.
    Created = 201, // Successfully created a new resource.
    Accepted = 202, // Request accepted, but still processing.
    NoContent = 204, // Successful request but no content to return.
  
    // Redirection
    MovedPermanently = 301, // Resource has moved permanently.
    Found = 302, // Resource has moved temporarily.
  
    // Client Errors
    BadRequest = 400, // The server cannot process the request due to client error.
    Unauthorized = 401, // Authentication is required and has failed or not yet been provided.
    Forbidden = 403, // The request was valid, but the server is refusing action.
    NotFound = 404, // The requested resource could not be found.
    MethodNotAllowed = 405, // The request method is not supported for the requested resource.
    NotAcceptable = 406, // The requested resource is only capable of generating content not acceptable according to the Accept headers sent in the request.
    Conflict = 409, // The request could not be processed because of conflict in the request.
    UnprocessableEntity = 422, // The request was well-formed but was unable to be followed due to semantic errors.
  
    // Server Errors
    InternalServerError = 500, // A generic error message when an unexpected condition was encountered.
    NotImplemented = 501, // The server either does not recognize the request method, or it lacks the ability to fulfill the request.
    BadGateway = 502, // The server was acting as a gateway or proxy and received an invalid response from the upstream server.
    ServiceUnavailable = 503, // The server is currently unavailable (overloaded or down).
    GatewayTimeout = 504, // The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.
  }
  

interface AssessmentErrorProps {
  sessionId: string | undefined;
  paramSessionId: string | undefined;
  pathname: string;
}

const AssessmentError = ({ sessionId, paramSessionId, pathname }: AssessmentErrorProps) => {
  console.log('Invalid session - showing error message. SessionId:', sessionId, 'AssessmentLink:', null);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Assessment Link Invalid</h1>
        <p className="text-gray-600 mb-4">This assessment link is invalid or has expired.</p>
        <p className="text-sm text-gray-500">Please contact your healthcare provider for a new assessment link.</p>
        <div className="mt-4 p-4 bg-gray-100 rounded text-xs text-gray-500">
          <div>Debug Info:</div>
          <div>SessionId = {sessionId || 'undefined'}</div>
          <div>URL = {pathname}</div>
          <div>ParamSessionId = {paramSessionId || 'undefined'}</div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentError;

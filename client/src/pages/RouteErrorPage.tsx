import { useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { ErrorFallback } from "@/components";


const RouteErrorPage = () => {

    const error = useRouteError();

    const message = isRouteErrorResponse(error) ?
        error.statusText
        :
        error instanceof Error ?
            error.message
            :
            'Something went wrong';

    return <ErrorFallback message={message} />
};

export default RouteErrorPage;
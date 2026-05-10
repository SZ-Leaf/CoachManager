import Alert from '../ui/feedback/Alert.jsx';
import Spinner from '../ui/feedback/Spinner.jsx';

export default function CrudListShell({
  isLoading,
  error,
  whenInitialEmpty,
  initialEmptyContent,
  whenFilteredEmpty,
  filteredEmptyContent,
  hasRows,
  children,
}) {
  if (isLoading) {
    return <Spinner />;
  }
  if (error) {
    return <Alert variant="error">{error.message}</Alert>;
  }
  if (whenInitialEmpty) {
    return initialEmptyContent;
  }
  if (whenFilteredEmpty) {
    return filteredEmptyContent;
  }
  if (!hasRows) {
    return null;
  }
  return children;
}

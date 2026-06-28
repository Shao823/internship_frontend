import { lazy, Suspense } from 'react';
import type { ReactNode } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import LoadingState from '@/components/LoadingState';
import DemoLayout from '@/layouts/DemoLayout';

const HomePage = lazy(() => import('@/pages/HomePage'));
const DataImportPage = lazy(() => import('@/pages/DataImportPage'));
const ProjectSelectionPage = lazy(() => import('@/pages/ProjectSelectionPage'));
const AlgorithmPage = lazy(() => import('@/pages/AlgorithmPage'));
const ChartAnalysisPage = lazy(() => import('@/pages/ChartAnalysisPage'));
const ReportPreviewPage = lazy(() => import('@/pages/ReportPreviewPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

const lazyPage = (element: ReactNode) => <Suspense fallback={<LoadingState />}>{element}</Suspense>;

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DemoLayout />,
    children: [
      {
        index: true,
        element: lazyPage(<HomePage />),
      },
      {
        path: 'data-import',
        element: lazyPage(<DataImportPage />),
      },
      {
        path: 'projects',
        element: lazyPage(<ProjectSelectionPage />),
      },
      {
        path: 'algorithm',
        element: lazyPage(<AlgorithmPage />),
      },
      {
        path: 'charts',
        element: lazyPage(<ChartAnalysisPage />),
      },
      {
        path: 'report',
        element: lazyPage(<ReportPreviewPage />),
      },
      {
        path: '*',
        element: lazyPage(<NotFoundPage />),
      },
    ],
  },
]);

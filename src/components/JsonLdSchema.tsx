import React from 'react';
import { Helmet } from 'react-helmet';

interface JsonLdSchemaProps {
  schema: Record<string, any>;
}

const JsonLdSchema = ({ schema }: JsonLdSchemaProps) => {
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

export default JsonLdSchema;

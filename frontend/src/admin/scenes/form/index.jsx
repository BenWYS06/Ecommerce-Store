import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  FormControlLabel,
  MenuItem,
  Switch,
  TextField,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Formik } from "formik";
import * as yup from "yup";
import Header from "../../components/Header";
import axios from "../../../lib/axios";
import { brands } from "../../../constants/brands";

const categories = ["men", "women", "kids"];

const splitList = (value) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const parseSizes = (value) =>
  splitList(value).map((item) => {
    const [size, stock] = item.split(":");

    return {
      size: size.trim(),
      stock: Number(stock.trim()),
    };
  });

const buildProductPayload = (values) => ({
  name: values.name.trim(),
  description: values.description.trim(),
  brand: values.brand,
  category: values.category,
  price: Number(values.price),
  discountPrice: Number(values.discountPrice),
  images: splitList(values.images),
  sizes: parseSizes(values.sizes),
  colors: splitList(values.colors),
  stock: Number(values.stock),
  tags: splitList(values.tags),
  isFeatured: values.isFeatured,
});

const Form = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleFormSubmit = async (values, { resetForm }) => {
    setSuccessMessage("");
    setErrorMessage("");

    try {
      await axios.post("/products", buildProductPayload(values));
      resetForm();
      setSuccessMessage("Product created successfully.");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Unable to create product.",
      );
    }
  };

  return (
    <Box m="20px">
      <Header title="CREATE PRODUCT" subtitle="Add a New Product" />

      {successMessage && (
        <Alert severity="success" sx={{ mb: "20px" }}>
          {successMessage}
        </Alert>
      )}
      {errorMessage && (
        <Alert severity="error" sx={{ mb: "20px" }}>
          {errorMessage}
        </Alert>
      )}

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={productSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="24px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                label="Product Name"
                name="name"
                value={values.name}
                onBlur={handleBlur}
                onChange={handleChange}
                error={!!touched.name && !!errors.name}
                helperText={touched.name && errors.name}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                select
                fullWidth
                variant="filled"
                label="Brand"
                name="brand"
                value={values.brand}
                onBlur={handleBlur}
                onChange={handleChange}
                error={!!touched.brand && !!errors.brand}
                helperText={touched.brand && errors.brand}
                sx={{ gridColumn: "span 1" }}
              >
                {brands.map((brand) => (
                  <MenuItem key={brand.id} value={brand.name}>
                    {brand.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                fullWidth
                variant="filled"
                label="Category"
                name="category"
                value={values.category}
                onBlur={handleBlur}
                onChange={handleChange}
                error={!!touched.category && !!errors.category}
                helperText={touched.category && errors.category}
                sx={{ gridColumn: "span 1" }}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                multiline
                minRows={4}
                variant="filled"
                label="Description"
                name="description"
                value={values.description}
                onBlur={handleBlur}
                onChange={handleChange}
                error={!!touched.description && !!errors.description}
                helperText={touched.description && errors.description}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Price"
                name="price"
                value={values.price}
                onBlur={handleBlur}
                onChange={handleChange}
                error={!!touched.price && !!errors.price}
                helperText={touched.price && errors.price}
                inputProps={{ min: 0, step: "0.01" }}
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Discount Price"
                name="discountPrice"
                value={values.discountPrice}
                onBlur={handleBlur}
                onChange={handleChange}
                error={!!touched.discountPrice && !!errors.discountPrice}
                helperText={touched.discountPrice && errors.discountPrice}
                inputProps={{ min: 0, step: "0.01" }}
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Total Stock"
                name="stock"
                value={values.stock}
                onBlur={handleBlur}
                onChange={handleChange}
                error={!!touched.stock && !!errors.stock}
                helperText={touched.stock && errors.stock}
                inputProps={{ min: 0, step: 1 }}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Image URLs"
                placeholder="https://example.com/front.jpg, https://example.com/back.jpg"
                name="images"
                value={values.images}
                onBlur={handleBlur}
                onChange={handleChange}
                error={!!touched.images && !!errors.images}
                helperText={touched.images && errors.images}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Sizes and Stock"
                placeholder="S:10, M:15, L:8"
                name="sizes"
                value={values.sizes}
                onBlur={handleBlur}
                onChange={handleChange}
                error={!!touched.sizes && !!errors.sizes}
                helperText={touched.sizes && errors.sizes}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Colors"
                placeholder="Black, White, Red"
                name="colors"
                value={values.colors}
                onBlur={handleBlur}
                onChange={handleChange}
                error={!!touched.colors && !!errors.colors}
                helperText={touched.colors && errors.colors}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Tags"
                placeholder="new-arrival, summer, sale"
                name="tags"
                value={values.tags}
                onBlur={handleBlur}
                onChange={handleChange}
                error={!!touched.tags && !!errors.tags}
                helperText={touched.tags && errors.tags}
                sx={{ gridColumn: "span 3" }}
              />
              <FormControlLabel
                control={
                  <Switch
                    color="secondary"
                    name="isFeatured"
                    checked={values.isFeatured}
                    onChange={handleChange}
                  />
                }
                label="Featured Product"
                sx={{ gridColumn: "span 1", alignSelf: "center" }}
              />
            </Box>

            <Box display="flex" justifyContent="end" mt="20px">
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Product"}
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const productSchema = yup.object().shape({
  name: yup.string().trim().required("Product name is required"),
  description: yup.string().trim().required("Description is required"),
  brand: yup.string().oneOf(brands.map((brand) => brand.name)).required("Brand is required"),
  category: yup
    .string()
    .oneOf(categories)
    .required("Category is required"),
  price: yup
    .number()
    .typeError("Price must be a number")
    .min(0, "Price cannot be negative")
    .required("Price is required"),
  discountPrice: yup
    .number()
    .typeError("Discount price must be a number")
    .min(0, "Discount price cannot be negative")
    .test(
      "discount-price",
      "Discount price cannot be higher than price",
      function validateDiscount(value) {
        return value <= Number(this.parent.price || 0);
      },
    )
    .required("Discount price is required"),
  stock: yup
    .number()
    .typeError("Stock must be a number")
    .integer("Stock must be a whole number")
    .min(0, "Stock cannot be negative")
    .required("Stock is required"),
  images: yup
    .string()
    .test("image-urls", "Use valid http or https image URLs", (value) =>
      value
        ? splitList(value).every((image) => /^https?:\/\//i.test(image))
        : true,
    ),
  sizes: yup
    .string()
    .test(
      "sizes-format",
      "Use size:stock format, for example S:10, M:15",
      (value) =>
        value
          ? splitList(value).every((item) => {
              const [size, stock, extra] = item.split(":");
              return (
                !extra &&
                Boolean(size?.trim()) &&
                /^\d+$/.test(stock?.trim() || "")
              );
            })
          : true,
    ),
  colors: yup.string(),
  tags: yup.string(),
  isFeatured: yup.boolean(),
});

const initialValues = {
  name: "",
  description: "",
  brand: "",
  category: "men",
  price: "",
  discountPrice: 0,
  images: "",
  sizes: "",
  colors: "",
  stock: 0,
  tags: "",
  isFeatured: false,
};

export default Form;

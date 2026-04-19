package com.hobbyhub.api.util;

import java.util.regex.Pattern;

public class ValidationUtil {

    // Regex din GeeksforGeeks - valideaza formatul email-ului
    // https://www.geeksforgeeks.org/java/check-email-address-valid-not-java/
    private static final String EMAIL_REGEX =
            "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@"
                    + "(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";

    // Regex inspirat din Baeldung - valideaza complexitatea parolei
    // https://www.baeldung.com/java-regex-password-validation
    // Minim 8 caractere, 1 litera mare, 1 cifra, 1 caracter special, fara spatii
    private static final String PASSWORD_REGEX =
            "^(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&+=!])(?=\\S+$).{8,}$";

    private static final Pattern EMAIL_PATTERN = Pattern.compile(EMAIL_REGEX);
    private static final Pattern PASSWORD_PATTERN = Pattern.compile(PASSWORD_REGEX);

    /**
     * Verifica daca email-ul respecta formatul standard.
     */
    public static boolean isValidEmail(String email) {
        return email != null && EMAIL_PATTERN.matcher(email).matches();
    }

    /**
     * Verifica daca parola respecta criteriile de complexitate:
     * - minim 8 caractere
     * - cel putin 1 litera mare
     * - cel putin 1 cifra
     * - cel putin 1 caracter special (@#$%^&+=!)
     * - fara spatii
     */
    public static boolean isValidPassword(String password) {
        return password != null && PASSWORD_PATTERN.matcher(password).matches();
    }
}

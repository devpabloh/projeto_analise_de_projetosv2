import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import styles from "./Register.module.css"

function Register() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
    })

    const [errors, setErrors] = useState({})
    const [submitError, setSubmitError] = useState("")

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return regex.test(email)
    }

    const validatePhone = (phone) => {
        const regex = /^\(?([0-9]{2})\)?[-. ]?([0-9]{5})[-. ]?([0-9]{4})$/
        return regex.test(phone)
    }

    const formatPhone = (value) => {
        const numbers = value.replace(/\D/g, '')
        
        if (numbers.length <= 2) {
            return numbers
        } else if (numbers.length <= 7) {
            return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
        } else {
            return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
        }
    }

    const validatePassword = (password) => {
        return password.length >= 6
    }
    
    const handleChange = (e) => {
        const { name, value } = e.target
        
        if (name === 'phone') {
            const formattedPhone = formatPhone(value)
            setFormData(prev => ({
                ...prev,
                [name]: formattedPhone
            }))
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }))
        }
    
        const newErrors = { ...errors }
    
        switch (name) {
            case 'email':
                if (!validateEmail(value)) {
                    newErrors.email = 'Email inválido'
                } else {
                    delete newErrors.email
                }
                break
                case 'phone':
                    if (!validatePhone(formatPhone(value))) {
                        newErrors.phone = 'Telefone inválido (XX XXXXX-XXXX)'
                    } else {
                        delete newErrors.phone
                    }
                    break
            case 'password':
                if (!validatePassword(value)) {
                    newErrors.password = 'Senha deve ter no mínimo 6 caracteres'
                } else {
                    delete newErrors.password
                }
                if (value !== formData.confirmPassword) {
                    newErrors.confirmPassword = 'Senhas não conferem'
                }
                break
            case 'confirmPassword':
                if (value !== formData.password) {
                    newErrors.confirmPassword = 'Senhas não conferem'
                } else {
                    delete newErrors.confirmPassword
                }
                break
        }
    
        setErrors(newErrors)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (Object.keys(errors).length > 0) {
            setSubmitError("Por favor, corrija os erros antes de enviar")
            return
        }
    
        try {
            await axios.post(
                "http://localhost:3000/analiseDeProjetos/auth/register", 
                {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password
                }
            )
            
            navigate('/')
        } catch (err) {
            setSubmitError(err.response?.data?.message || "Erro ao registrar usuário")
        }
    }

    return (
        <div className={styles.registerWrapper}>
            <div className={styles.containerRegister}>
                <h1>Registro</h1>
                {submitError && <p className={styles.errorMessage}>{submitError}</p>}
            
                <form onSubmit={handleSubmit} className={styles.formRegister}>
                    <div className={styles.inputGroup}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Nome completo"
                            value={formData.name}
                            onChange={handleChange}
                            className={errors.name ? styles.inputError : ''}
                            required
                        />
                        {errors.name && <span className={styles.errorText}>{errors.name}</span>}
                    </div>
                    <div className={styles.inputGroup}>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className={errors.email ? styles.inputError : ''}
                            required
                        />
                        {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                    </div>
                    <div className={styles.inputGroup}>
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Telefone (XX XXXXX-XXXX)"
                            value={formData.phone}
                            onChange={handleChange}
                            className={errors.phone ? styles.inputError : ''}
                            required
                        />
                        {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
                    </div>
                    <div className={styles.inputGroup}>
                        <input
                            type="password"
                            name="password"
                            placeholder="Senha"
                            value={formData.password}
                            onChange={handleChange}
                            className={errors.password ? styles.inputError : ''}
                            required
                        />
                        {errors.password && <span className={styles.errorText}>{errors.password}</span>}
                    </div>
                    <div className={styles.inputGroup}>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirme a senha"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={errors.confirmPassword ? styles.inputError : ''}
                            required
                        />
                        {errors.confirmPassword && <span className={styles.errorText}>{errors.confirmPassword}</span>}
                    </div>
                    <div className={styles.buttonGroup}>
                        <button type="submit">Registrar</button>
                        <button type="button" onClick={() => navigate('/')}>Voltar</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register